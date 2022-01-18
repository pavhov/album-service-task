import {info} from "../utils/logger/lib";
import Module from "./../interfaces/Module";
import DBStory from "./DBStory";

export const modules: any[] = [];
export const staticModules: { [key: string]: DBStory[] } = {};

/**
 * @name CModule
 */
export default abstract class CModule implements Module {

    /**
     * @name proc
     * @protected
     */
    public proc: NodeJS.Process;

    [key: string]: any;

    /**
     * @name CModule
     * @protected
     */
    protected constructor() {
        this.proc = process;
    }

    /**
     * @name init
     * @async
     */
    init(): Promise<void> {
        info(`Starting ${this.constructor.name} module`);
        this.proc.on("exit", () => this.stop());
        return this.context();
    }

    /**
     * @name stop
     * @async
     */
    stop(): Promise<void> {
        return this.destroy();
    }

    /**
     * @name context
     * @protected
     */
    protected abstract context(): Promise<void>;

    /**
     * @name destroy
     * @protected
     */
    protected abstract destroy(): Promise<void>;
}
