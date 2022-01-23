import Express from "express";
import ajv from "../../../../../../lib/utils/ajv/lib";
import {Photo} from "../../../../../story/photo/Iinterface";
import {AnyValidateFunction} from "ajv/lib/types";

/**
 * @name PhotoDeleteMiddleware
 */
export class PhotoDeleteMiddleware {

    /**
	 * @name _instance
	 * @private
	 */
    private static _instance: PhotoDeleteMiddleware;

    constructor() {
        ajv.addSchema({
            $async: true,
            type: "object",
            properties: {
                photoid: {
                    type: "string",
                    format: "coma-seperated"
                },
                owner: {
                    type: "string"
                }
            },
            required: ["photoid", "owner"],
            additionalProperties: false
        }, "photoDeleteSchema");
    }


    /**
	 * @name Instance
	 * @constructor
	 */
    static Instance(): PhotoDeleteMiddleware {
        if (!PhotoDeleteMiddleware._instance) {
            PhotoDeleteMiddleware._instance = new PhotoDeleteMiddleware();
        }

        return PhotoDeleteMiddleware._instance;
    }

    /**
	 * @name before
	 * @param req
	 * @param res
	 * @param next
	 * @protected
	 */
    protected async before(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction): Promise<any> {
        const validate: AnyValidateFunction<Photo.Request.DeletePhoto> = ajv.getSchema("photoDeleteSchema");
        try {
            const query = await validate({...req?.context?.body, ...req.query}) as Photo.Request.DeletePhoto;
            req.context = {...req.context, query: {...query, photoid: (query.photoid as string).split(",")}};
            await next();
        } catch (err) {
            await next(err);
        }
    }
}
