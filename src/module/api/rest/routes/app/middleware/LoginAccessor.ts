import Express                 from "express";
import ajv                     from "../../../../../../lib/utils/ajv/lib";
import { AnyValidateFunction } from "ajv/lib/types";
import { Auth }                from "../../../../../story/auth/Iinterface";

/**
 * @name LoginAccessor
 */
export class LoginAccessor {

    /**
     * @name _instance
     * @private
     */
    private static _instance: LoginAccessor;

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
        const validate: AnyValidateFunction<Auth.Request.Login> = ajv.getSchema('loginRequestSchema');
        try {
            const body = await validate(req.body);
            req.context = {body};
            await next();
        } catch (e) {
            await next(e);
        }
    }
}
