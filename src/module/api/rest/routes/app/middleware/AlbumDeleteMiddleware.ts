import Express from "express";
import ajv from "../../../../../../lib/utils/ajv/lib";
import {Photo} from "../../../../../story/photo/Iinterface";
import {AnyValidateFunction} from "ajv/lib/types";

/**
 * @name AlbumDeleteMiddleware
 */
export class AlbumDeleteMiddleware {

    /**
	 * @name _instance
	 * @private
	 */
    private static _instance: AlbumDeleteMiddleware;

    constructor() {
        ajv.addSchema({
            $async: true,
            type: "object",
            properties: {
                albumid: {
                    type: "string",
                    format: "coma-seperated"
                },
                owner: {
                    type: "string"
                }
            },
            required: ["albumid", "owner"],
            additionalProperties: false
        }, "albumDeleteSchema");
    }


    /**
	 * @name Instance
	 * @constructor
	 */
    static Instance(): AlbumDeleteMiddleware {
        if (!AlbumDeleteMiddleware._instance) {
            AlbumDeleteMiddleware._instance = new AlbumDeleteMiddleware();
        }

        return AlbumDeleteMiddleware._instance;
    }

    /**
	 * @name before
	 * @param req
	 * @param res
	 * @param next
	 * @protected
	 */
    protected async before(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction): Promise<any> {
        const validate: AnyValidateFunction<Photo.Request.DeleteAlbum> = ajv.getSchema("albumDeleteSchema");
        try {
            const query = await validate({...req?.context?.body, ...req.query}) as Photo.Request.DeleteAlbum;
            req.context = {...req.context, query: {...query, albumid: (query.albumid as string).split(",")}};
            await next();
        } catch (err) {
            await next(err);
        }
    }
}
