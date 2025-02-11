import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabaseClient.js";

export const repositories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await supabase
      .from("repositories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching repositories" });
    next(error);
  }
};

export const components = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const { data, error } = await supabase.from('components').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching components' });
        next(error);
      }
  };

  export const socialMedia = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const { data, error } = await supabase.from('social_media').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching social media news' });
        next(error);
      }
  };

  export const recent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const [
        { data: repositories, error: repoError },
        { data: components, error: componentError },
        { data: social_media, error: socialError }
      ] = await Promise.all([
        supabase.from("repositories").select("*").order("created_at", { ascending: false }).limit(9),
        supabase.from("components").select("*").order("created_at", { ascending: false }).limit(9),
        supabase.from("social_media").select("*").order("created_at", { ascending: false }).limit(9)
      ]);
  
      if (repoError || componentError || socialError) {
        throw new Error("Error fetching recent data");
      }
  
      res.json({ repositories, components, social_media });
    } catch (error) {
      res.status(500).json({ error: "Error fetching recent items" });
      next(error);
    }
  };