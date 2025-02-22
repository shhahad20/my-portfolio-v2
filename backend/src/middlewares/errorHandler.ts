// Centralized Error-Handling
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import ApiError from '../errors/ApiError.js';

const apiErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.code).json({ 
      status: err.code,
      message: err.message,
    });
  } else {
    console.error('Unhandled Error:', err);
    res.status(500).json({ 
      status: 500,
      message: 'Something went wrong.',
    });
  }
};

export default apiErrorHandler;



