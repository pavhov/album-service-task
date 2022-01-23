import Express                 from "express";
import ajv                     from "../../../../../../lib/utils/ajv/lib";
import { AnyValidateFunction } from "ajv/lib/types";
import { Auth }                from "../../../../../story/auth/Iinterface";

/**
 * @name LoginAccessor
 */
export class RegisterAccessor {

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
        const validate: AnyValidateFunction<Auth.Request.Register> = ajv.getSchema('registerRequestSchema');
        try {
            const body = await validate(req.body);
            req.context = {body};
            await next();
        } catch (e) {
            await next(e);
        }
    }
}
