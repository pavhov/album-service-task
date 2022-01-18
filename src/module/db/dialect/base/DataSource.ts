import DBStory from "../../../../lib/abstract/DBStory";
import {ModuleInt} from "../../../../lib/decorators/CModule";
import MonoDataSource from "../mongo/DataSource";
import CModule, {staticModules} from "./../../../../lib/abstract/CModule";

/**
 * @name DataSource
 */
@ModuleInt
export default class DataSource extends CModule {
    private staticModules: { [p: string]: DBStory[] };

    /**
   * @name _dataSource
   * @private
   */
    private readonly _dataSource: {
        mongo: MonoDataSource;
    };

    /**
   * @name DataSource
   */
    constructor() {
        super();

        this._dataSource = {
            mongo: new MonoDataSource(),
        };
        this.staticModules = staticModules;

        if (!DataSource._instance) {
            DataSource._instance = this;
        }
    }

    /**
     * @name _instance
     * @private
     */
    private static _instance: DataSource;

    /**
     * @name get instance
     */
    static get instance(): DataSource {
        return this._instance;
    }

    /**
     * @name set instance
     */
    static set instance(_value: DataSource) {
        throw new Error("Not able to set instance")
    }

    /**
     * @name get dataSource
     */
    get dataSource() {
        return this._dataSource;
    }

    /**
     * @name set dataSource
     */
    set dataSource(_value) {
        throw new Error("Not able to set dataSource")
    }

    /**
     * @name context
     * @protected
     */
    protected async context(): Promise<void> {
        for (const name in this.dataSource) {
            await this.dataSource[name].init();
        }
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
