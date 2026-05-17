import { fetchData } from "../services/fetchData.js";
export const projects = (req, res, next) => {
    fetchData("projects", req, res, next, ["*"]);
};
