import { NextFunction, Request, Response } from "express";

import { fetchData } from "../services/fetchData.js";

export const projects = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  fetchData("projects", req, res, next, ["*"]);

};