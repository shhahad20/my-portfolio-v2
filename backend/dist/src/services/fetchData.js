import { supabase } from "../config/supabaseClient.js";
import ApiError from "../errors/ApiError.js";
/**
 * Centralized function to fetch data from a given table.
 *
 * @param table - The table name in Supabase.
 * @param req - Express Request containing query parameters.
 * @param res - Express Response to send the data.
 * @param next - Express NextFunction for error handling.
 * @param allowedSearchColumns - Optional array of columns to perform search on.
 */
export const fetchData = async (table, req, res, next, allowedSearchColumns) => {
    try {
        let query = supabase.from(table).select("*");
        // Apply search if a search term is provided.
        const searchTerm = req.query.search;
        if (searchTerm && allowedSearchColumns && allowedSearchColumns.length > 0) {
            // Build a query string that searches across the allowed columns using ilike.
            const orQuery = allowedSearchColumns
                .map((col) => `${col}.ilike.%${searchTerm}%`)
                .join(",");
            query = query.or(orQuery);
        }
        // Sorting: Use query parameters sortField and sortOrder if provided.
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder; // expects "asc" or "desc"
        if (sortField) {
            query = query.order(sortField, { ascending: sortOrder !== "desc" });
        }
        else {
            // Default sorting by created_at descending.
            query = query.order("created_at", { ascending: false });
        }
        // Optional: Add pagination support with limit.
        const limit = req.query.limit;
        if (limit) {
            query = query.limit(parseInt(limit, 10));
        }
        // Execute the query.
        const { data, error } = await query;
        if (error)
            throw ApiError.internal(`Error fetching data from ${table}`);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
};
