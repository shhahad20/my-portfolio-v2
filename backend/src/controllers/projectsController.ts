import { NextFunction, Request, Response } from "express";

import { fetchData, fetchDataById } from "../services/fetchData.js";

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
) => fetchDataById("projects", req, res, next);