import {Logger, MongoClient, MongoClientOptions} from "mongodb";
import {debug, info} from "../../../../lib/utils/logger/lib";

import CModule, {staticModules} from "./../../../../lib/abstract/CModule";
import Params from "./../../../../lib/utils/config/Params";

/**
 * @name MongoDataSource
 */
export default class MongoDataSource extends CModule {

    /**
   * @name _options
   * @private
   */
    private readonly _options: {
    url: string;
    options: MongoClientOptions;
  };

    /**
   * @name _connector
   * @private
   */
    private readonly _connector: MongoClient;

    /**
   * @name MongoDataSource
   */
    constructor() {
        super();
        this._options = {
            url: Params.db.mongo.url,
            options: Params.db.mongo.options
        };

        Logger.setCurrentLogger(debug);
        Logger.setLevel(Params.db.mongo.logging);
        this._connector = new MongoClient(this._options.url, this._options.options);
    }

    /**
   * @name _instance
   * @private
   */
    private static _instance: MongoDataSource;

    /**
   * @name get instance
   */
    public static get instance() {
        return this._instance;
    }

    /**
   * @name get connector
   */
    public get connector() {
        return this._connector;
    }

    /**
   * @name context
   * @protected
   */
    protected async context(): Promise<void> {
        await this._connector.connect();
        for await (const mod of staticModules.mongo || []) {
            await mod.init(this._connector);
        }

        info(`Dialect started on ${this._options.url}`);
        return Promise.resolve(undefined);
    }

    /**
   * @name destroy
   * @protected
   */
    protected async destroy(): Promise<void> {
        console.log("gago");
        await this._connector.close();
        return Promise.resolve(undefined);
    }
}
