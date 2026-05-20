import { fetchData, fetchProjectDataById } from "../services/fetchData.js";
export const projects = (req, res, next) => {
    fetchData("projects", req, res, next, ["*"]);
};
export const getProjectById = (req, res, next) => fetchProjectDataById("projects", req, res, next);
