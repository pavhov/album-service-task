import {Request, Response, NextFunction, Errback} from "express";
import HttpError from "./../../../../lib/error/HttpError";
import {error} from "../../../../lib/utils/logger/lib";

export const Error404Handler = (req: Request, res: Response, next: NextFunction) => {
    const status = 404;
    const httpErr = new HttpError("Not found", status);
    res.status(status).json(httpErr);
    error(httpErr);
};

export const ExpressionHandler = (err: Error | any, req: Request, res: Response, next: NextFunction) => {
    const status = parseInt(err.code || err.status) || 400;
    const httpErr = new HttpError(`${err.name} ${err.message}`, status, err.errors);
    res.status(status).json(httpErr);
    error(httpErr);
};
