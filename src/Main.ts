import ApplicationRunner from "./lib/abstract/ApplicationRunner";
import {modules} from "./lib/abstract/CModule";
import Application  from "./lib/decorators/Application";
import {ModuleImpl} from "./lib/decorators/Module";
import "./lib/utils/global";
import {error} from "./lib/utils/logger/lib";

/**
 * @name Main
 */
@ModuleImpl(...modules)
@Application()
class Main extends ApplicationRunner<Main> {

    /**
     * @name main
     * @return Promise
     */
    async main(): Promise<void> {
        try {
            for (const mod of this.modules) {
                await mod.init();
            }
        } catch (err) {
            error(err);
            await this.shutdown();
            process.exit(1);
        }
    }

    /**
     * @name shutdown
     * @return Promise
     */
    async shutdown(): Promise<void> {
        await Promise.all(this.modules.map((value) => value.stop()));
    }

}
