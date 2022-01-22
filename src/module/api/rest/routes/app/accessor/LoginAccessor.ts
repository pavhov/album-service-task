import Express         from "express";
import ajv             from "../../../../../../lib/utils/ajv/lib";

/**
 * @name LoginAccessor
 */
export class LoginAccessor {

    /**
     * @name _options
     * @private
     */
    private readonly _options: any;

    /**
     * @name _instance
     * @private
     */
    private static _instance: LoginAccessor;

    /**
     * @name _requestSchema
     * @private
     */


    constructor() {
        ajv.addSchema({
            $async: true,
            type: "object",
            properties: {
                login: {
                    type: "string",
                },
                email: {
                    type: "string",
                    format: "email",
                },
                password: {
                    type: "string",
                },
            },
            required: ["password"],
            oneOf : [
                {required: ["login"]},
                {required: ["email"]},
            ],
            additionalProperties: false
        }, 'loginRequestSchema');
    }
    /**
     * @name Instance
     * @constructor
     */
    static Instance(): LoginAccessor {
        if (!LoginAccessor._instance) {
            LoginAccessor._instance = new LoginAccessor();
        }

        return LoginAccessor._instance;
    }

    /**
     * @name before
     * @param req
     * @param res
     * @param next
     * @protected
     */
    protected async before(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction): Promise<any> {
        const validate = ajv.getSchema('loginRequestSchema');
        try {
            const body = await validate(req.body);
            req.context = {body};
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
