import CModule from "./../../lib/abstract/CModule";
import {ModuleInt} from "../../lib/decorators/Module";

/**
 * @name Listener
 */
@ModuleInt
export default class Listener extends CModule {

    /**
     * @name Listener
     */
    constructor() {
        super();
    }

    /**
     * @name context
     */
    context(): Promise<void> {
        this.proc.on("rejectionHandled", (...args) => {
            console.error("rejectionHandled", ...args);
        });
        this.proc.on("uncaughtException", (...args) => {
            console.error("uncaughtException", ...args);
        });
        this.proc.on("unhandledRejection", (...args) => {
            console.error("unhandledRejection", ...args);
        });
        return Promise.resolve(undefined);
    }

    /**
     * @name destroy
     */
    destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
