import { supabase } from "../config/supabaseClient.js";
export async function getTestimonials(_req, res) {
    try {
        const { data, error } = await supabase
            .from("testimonials")
            .select("id, name, role, text, display_order")
            .eq("is_active", true)
            .order("display_order", { ascending: true });
        if (error) {
            console.error("Error fetching testimonials:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch testimonials",
                error: error.message,
            });
            return;
        }
        res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    }
    catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
