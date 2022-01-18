import {staticModules} from "../abstract/CModule";
import DBStory from "../abstract/DBStory";

/**
 * @name DBModule
 * @param state
 * @constructor
 */
export function DBModule(state: string) {
    return function<T extends new (...args: any[]) => any>(constructor: T) {
        if (!staticModules[state]) {
            staticModules[state] = [];
        }
        staticModules[state].push(((constructor as any).Instance() as unknown) as DBStory);
    };
}
