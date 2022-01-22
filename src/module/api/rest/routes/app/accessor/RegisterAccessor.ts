import Express         from "express";
import ajv             from "../../../../../../lib/utils/ajv/lib";

/**
 * @name LoginAccessor
 */
export class RegisterAccessor {

    /**
     * @name _options
     * @private
     */
    private readonly _options: any;

    /**
     * @name _instance
     * @private
     */
    private static _instance: RegisterAccessor;

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
                },
                password: {
                    type: "string",
                },
            },
            required: [
                "login",
                "email",
                "password",
            ],
            additionalProperties: false
        }, 'registerRequestSchema');
    }
    /**
     * @name Instance
     * @constructor
     */
    static Instance(): RegisterAccessor {
        if (!RegisterAccessor._instance) {
            RegisterAccessor._instance = new RegisterAccessor();
        }

        return RegisterAccessor._instance;
    }

    /**
     * @name before
     * @param req
     * @param res
     * @param next
     * @protected
     */
    protected async before(req: Express.Request & {context}, res: Express.Response, next: Express.NextFunction): Promise<any> {
        const validate = ajv.getSchema('registerRequestSchema');
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
