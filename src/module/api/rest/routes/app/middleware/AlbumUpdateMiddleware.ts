import Express                 from "express";
import ajv                     from "../../../../../../lib/utils/ajv/lib";
import { Photo }  from "../../../../../story/photo/Iinterface";
import { AnyValidateFunction } from "ajv/lib/types";

/**
 * @name AlbumUpdateMiddleware
 */
export class AlbumUpdateMiddleware {

	/**
	 * @name _instance
	 * @private
	 */
	private static _instance: AlbumUpdateMiddleware;

	constructor() {
		ajv.addSchema({
			$async: true,
			type: "object",
			properties: {
				albumid: {
					type: "string",
					format: "coma-seperated"
				},
				new_album_name: {
					type: "string"
				},
			},
			required: ["albumid", "new_album_name"],
			additionalProperties: false,
		}, "albumUpdateSchema");
	}
	/**
	 * @name Instance
	 * @constructor
	 */
	static Instance(): AlbumUpdateMiddleware {
		if (!AlbumUpdateMiddleware._instance) {
			AlbumUpdateMiddleware._instance = new AlbumUpdateMiddleware();
		}

		return AlbumUpdateMiddleware._instance;
	}

	/**
	 * @name before
	 * @param req
	 * @param res
	 * @param next
	 * @protected
	 */
	protected async before(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction): Promise<any> {
		const validate: AnyValidateFunction<Photo.Request.DeleteAlbum> = ajv.getSchema('albumUpdateSchema');
		try {
			req.context = {body: await validate(req.body)};
			await next();
		} catch (e) {
			await next(e);
		}
	}

	/**
	 * @name after
	 * @param req
	 * @param res
	 * @param next
	 * @protected
	 */
	protected async after(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<any> {
		next();
	}
}
