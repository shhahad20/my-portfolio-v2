import { NextFunction, Request, Response } from "express";

import { fetchData,  fetchDataById,  fetchProjectDataById } from "../services/fetchData.js";

export const projects = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  fetchData("projects", req, res, next, ["*"]);

};

export const getProjectById = (
  req: Request,
  res: Response,
  next: NextFunction
) => fetchProjectDataById("projects", req, res, next);
