import { Delete, Get, Patch, Post, Presenter, Put, Use } from "../../../../../lib/decorators/Express";
import Express                                           from "express";
import { LoginAccessor }                                 from "./middleware/LoginAccessor";
import { AuthStory }                                     from "../../../../story/auth/Story";
import { RegisterAccessor }                              from "./middleware/RegisterAccessor";
import { PhotoStory }                                    from "../../../../story/photo/Story";
import { BarerAccessor }                                 from "./middleware/BarerAccessor";
import { PaginationMiddleware }                          from "./middleware/PaginationMiddleware";
import { PhotoDeleteMiddleware }                         from "./middleware/PhotoDeleteMiddleware";
import { AlbumDeleteMiddleware }                         from "./middleware/AlbumDeleteMiddleware";
import { AlbumUpdateMiddleware }                         from "./middleware/AlbumUpdateMiddleware";

/**
 * @name AppPresenter
 */
@Presenter({path: "/"})
export default class AppPresenter {

    /**
     * @name stories
     * @private
     */
    private stories: {
        Auth: AuthStory,
        Photo: PhotoStory,
    };

    /**
     * @name AppPresenter
     */
    constructor() {
        this.stories = {
            Auth: new AuthStory,
            Photo: new PhotoStory,
        };
    }

    /**
     * @name "/login"
     * @param req
     * @param res
     * @param next
     */
    @Use(LoginAccessor)
    @Post()
    async "/login"(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json(await this.stories.Auth.login(req.context.body));
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
    @Use(RegisterAccessor)
    @Post()
    async "/register"(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json(await this.stories.Auth.register(req.context.body));
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
    @Use(BarerAccessor)
    @Patch()
    async "/load-photos"(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json(await this.stories.Photo.load(req.context.body));
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
    @Use(PaginationMiddleware)
    @Get()
    async "/get-photos"(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json(await this.stories.Photo.get(req.context.query));
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
    @Use(BarerAccessor)
    @Use(PhotoDeleteMiddleware)
    @Delete()
    async "/delete-photo"(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json(await this.stories.Photo.delete(req.context.query));
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
    @Use(BarerAccessor)
    @Use(AlbumDeleteMiddleware)
    @Delete()
    async "/delete-album"(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json(await this.stories.Photo.deleteAlbum(req.context.query));
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
    @Use(AlbumUpdateMiddleware)
    async "/change-album-title"(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction) {
        try {
            res.json(await this.stories.Photo.updateAlbum(req.context.body));
        } catch (err) {
            next(err);
        }
    }
}
