import { fetchData, fetchDataById } from "../services/fetchData.js";
export const projects = (req, res, next) => {
    fetchData("projects", req, res, next, ["*"]);
};
export const getProjectById = (req, res, next) => fetchDataById("projects", req, res, next);
