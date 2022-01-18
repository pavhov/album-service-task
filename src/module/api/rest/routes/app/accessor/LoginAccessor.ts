import {Context, Next} from "koa";
import Express         from "express";
import ajv             from "../../../../../../lib/utils/ajv/lib";
import bodyParser      from "koa-bodyparser";

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
                registerDate: {
                    type: "string",
                },
            },
            required: [
                "login",
                "email",
                "password",
                "registerDate",
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
    protected async before(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<any> {
        const {body} = req;
        const validate = ajv.getSchema('loginRequestSchema');
        try {
            await validate(body);
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
