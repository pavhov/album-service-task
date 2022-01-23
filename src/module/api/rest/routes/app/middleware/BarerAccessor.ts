import Express from "express";
import {AuthStory} from "../../../../../story/auth/Story";

/**
 * @name BarerAccessor
 */
export class BarerAccessor {

    /**
     * @name stories
     * @private
     */
    private stories: {
        Auth: AuthStory,
    };

    /**
     * @name _instance
     * @private
     */
    private static _instance: BarerAccessor;

    /**
     * @name BarerAccessor
     */
    constructor() {
        this.stories = {
            Auth: new AuthStory()
        };
    }


    /**
     * @name Instance
     * @constructor
     */
    static Instance(): BarerAccessor {
        if (!BarerAccessor._instance) {
            BarerAccessor._instance = new BarerAccessor();
        }

        return BarerAccessor._instance;
    }

    /**
     * @name before
     * @param req
     * @param res
     * @param next
     * @protected
     */
    protected async before(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction): Promise<any> {
        try {
            const authorization = req.header("authorization");
            req.context = {body: await this.stories.Auth.bearer({authorization: authorization.split(" ")[1]})};
            await next();
        } catch (err) {
            await next(err);
        }
    }
}
