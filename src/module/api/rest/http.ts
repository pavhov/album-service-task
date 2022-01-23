import Express from "express";

import CModule     from "./../../../lib/abstract/CModule";
import {ModuleInt} from "../../../lib/decorators/Module";
import Params      from "./../../../lib/utils/config/Params";
import {info} from "../../../lib/utils/logger/lib";
import {ExpressApi} from "../../../lib/decorators/Express";

/**
 * @name Http
 */
@ModuleInt
@ExpressApi
export default class Http extends CModule {

    /**
     * @name koa
     * @private
     */
    declare private express: Express.Application;

    /**
     * @name ip
     * @private
     */
    private readonly ip: string;

    /**
     * @name port
     * @private
     */
    private readonly port: number;

    /**
     * @name Http
     */
    public constructor() {
        super();

        this.ip = Params.api_http_ip;
        this.port = parseInt(Params.api_http_port);
    }

    /**
     * @name context
     * @protected
     */
    protected context(): Promise<void> {
        this.express.listen(this.port, this.ip, () => {
            info(`Express listening on http://${this.ip}:${this.port}`);
        });
        return Promise.resolve(undefined);
    }

    /**
     * @name destroy
     * @protected
     */
    protected destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
