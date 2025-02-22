import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabaseClient.js";
import ApiError from "../errors/ApiError.js";

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
      if (error) throw ApiError.internal("Error fetching repositories");
    res.json(data);
  } catch (error) {
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
        if (error) throw ApiError.internal("Error fetching components");
        res.json(data);
      } catch (error) {
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
        if (error) throw ApiError.internal("Error fetching social media news");
        res.json(data);
      } catch (error) {
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
        // throw new Error("Error fetching recent data");
        throw ApiError.internal("Error fetching recent data");
      }
      res.json({ repositories, components, social_media });
    } catch (error) {
      next(error);
    }
  };