import Express from "express";
import ajv     from "../../../../../../lib/utils/ajv/lib";

/**
 * @name PaginationMiddleware
 */
export class PaginationMiddleware {

	/**
	 * @name _instance
	 * @private
	 */
	private static _instance: PaginationMiddleware;

	constructor() {
		ajv.addSchema({
			$async: true,
			type: "object",
			properties: {
				ownerid: {
					type: "string"
				},
				page: {
					type: "number"
				},
				maxcount: {
					type: "number"
				},
			},
			required: ["ownerid", "page", "maxcount"],
			additionalProperties: true,
		}, "paginationSchema");
	}
	/**
	 * @name Instance
	 * @constructor
	 */
	static Instance(): PaginationMiddleware {
		if (!PaginationMiddleware._instance) {
			PaginationMiddleware._instance = new PaginationMiddleware();
		}

		return PaginationMiddleware._instance;
	}

	/**
	 * @name before
	 * @param req
	 * @param res
	 * @param next
	 * @protected
	 */
	protected async before(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction): Promise<any> {
		const validate = ajv.getSchema('paginationSchema');
		try {
			const query = await validate(req.query);
			req.context = {query};
			await next();
		} catch (e) {
			await next(e);
		}
	}
}
