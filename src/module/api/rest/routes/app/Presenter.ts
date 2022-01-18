import { Delete, Get, Patch, Post, Presenter, Put, Use } from "../../../../../lib/decorators/Express";
import Express from "express";
import { LoginAccessor } from "./accessor/LoginAccessor";

/**
 * @name AuthPresenter
 */
@Presenter({path: "/auth"})
export default class AppPresenter {

    /**
     * @name stories
     * @private
     */
    private stories: {
    };

    /**
     * @name AuthPresenter
     */
    constructor() {
        this.stories = {
        };
    }

    /**
     * @name "/login"
     * @param req
     * @param res
     * @param next
     */
    @Use(LoginAccessor)
    @Use(LoginAccessor)
    @Post()
    async "/login"(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json({});
        } catch (err) {
            next(err);
        }

    }

    /**
     * @name "/register"
     * @param req
     * @param res
     * @param next
     */
    @Post()
    async "/register"(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json({});
        } catch (err) {
            next(err);
        }

    }

    /**
     * @name "/load-photos"
     * @param req
     * @param res
     * @param next
     */
    @Patch()
    async "/load-photos"(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json({});
        } catch (err) {
            next(err);
        }

    }

    /**
     * @name "/get-photos"
     * @param req
     * @param res
     * @param next
     */
    @Get()
    async "/get-photos"(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json({});
        } catch (err) {
            next(err);
        }

    }

    /**
     * @name "/delete-photo"
     * @param req
     * @param res
     * @param next
     */
    @Delete()
    async "/delete-photo"(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json({});
        } catch (err) {
            next(err);
        }

    }

    /**
     * @name "/delete-album"
     * @param req
     * @param res
     * @param next
     */
    @Delete()
    async "/delete-album"(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json({});
        } catch (err) {
            next(err);
        }

    }

    /**
     * @name "/delete-album"
     * @param req
     * @param res
     * @param next
     */
    @Put()
    async "/change-album-title"(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json({});
        } catch (err) {
            next(err);
        }
    }
}
