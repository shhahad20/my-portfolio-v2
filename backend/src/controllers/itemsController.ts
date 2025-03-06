import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabaseClient.js";
import ApiError from "../errors/ApiError.js";
import { fetchData } from "../services/fetchData.js";

export const repositories = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // For repositories, assume you want to allow search on "name" and "description"
  fetchData("repositories", req, res, next, ["name", "description"]);
};

export const components = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // For components, allow search on "title" and "label"
  fetchData("components", req, res, next, ["title", "label"]);
};

export const socialMedia = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // For social media, allow search on "platform" and "title"
  fetchData("social_media", req, res, next, ["platform", "title"]);
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