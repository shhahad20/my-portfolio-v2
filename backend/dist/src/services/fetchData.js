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
        console.log(`Fetched data from ${table} with search term: ${searchTerm || "none"}`);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Fetch a single record by its ID from a given table.
 *
 * @param table - The table name in Supabase.
 * @param req - Express Request containing `req.params.id`.
 * @param res - Express Response to send the record.
 * @param next - Express NextFunction for error handling.
 * @param idColumn - Optional column name to use as the identifier (default: "id").
 */
export const fetchDataById = async (table, req, res, next, idColumn = "id") => {
    try {
        const { id } = req.params;
        if (!id) {
            throw ApiError.badRequest("ID parameter is required");
        }
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .eq(idColumn, id)
            .single();
        if (error) {
            // PGRST116 = No rows returned
            if (error.code === "PGRST116") {
                throw ApiError.notFound(`Record with ${idColumn} "${id}" not found in ${table}`);
            }
            throw ApiError.internal(`Error fetching record from ${table}`);
        }
        res.json(data);
        console.log(`Fetched record from ${table} where ${idColumn} = ${id}`);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Fetch a single record by its ID from a given table.
 *
 * Supports nested relations for the `projects` table by automatically
 * including all related rows from `project_media`, ordered by `sort_order`.
 *
 * @param table - The table name in Supabase.
 * @param req - Express Request containing `req.params.id`.
 * @param res - Express Response to send the record.
 * @param next - Express NextFunction for error handling.
 * @param idColumn - Optional column name to use as the identifier (default: "id").
 */
export const fetchProjectDataById = async (table, req, res, next, idColumn = "id") => {
    try {
        const { id } = req.params;
        if (!id) {
            throw ApiError.badRequest("ID parameter is required");
        }
        // Explicit FK hint (project_media_project_id_fkey) ensures PostgREST
        // resolves the relationship even if the FK isn't named conventionally.
        const selectQuery = table === "projects"
            ? `
            *,
            project_media!project_media_project_id_fkey (
              id,
              media_url,
              media_type,
              alt_text,
              sort_order,
              created_at
            )
          `
            : "*";
        let query = supabase
            .from(table)
            .select(selectQuery)
            .eq(idColumn, id);
        if (table === "projects") {
            query = query.order("sort_order", {
                foreignTable: "project_media",
                ascending: true,
            });
        }
        const { data, error } = await query.single();
        if (error) {
            if (error.code === "PGRST116") {
                throw ApiError.notFound(`Record with ${idColumn} "${id}" not found in ${table}`);
            }
            console.error(`Supabase error fetching ${table}:`, error);
            throw ApiError.internal(`Error fetching record from ${table}`);
        }
        // Normalize project_media -> media[] and strip the raw join key.
        if (table === "projects" &&
            data &&
            Array.isArray(data.project_media)) {
            const project = data;
            // Preserve full media objects instead of just URLs for frontend flexibility.
            project.media = project.project_media;
            // Remove raw join key so the response shape is clean.
            delete project.project_media;
        }
        console.log(`Fetched record from ${table} where ${idColumn} = ${id}`);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
};
