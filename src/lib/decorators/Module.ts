import {modules} from "../abstract/CModule";

/**
 * @name CModule
 * @param module
 * @constructor
 */
export function ModuleImpl<M>(...module: M[]) {
    return function<T extends new (...args: any[]) => any>(constructor: T) {
        (constructor as any).instance.modules.push(...module.map((value) => new (value as any)()));
    };
}

/**
 * @name ModuleInt
 * @param constructor
 * @constructor
 */
export function ModuleInt<T extends new (...args: any[]) => any>(constructor: T) {
    modules.push(constructor);
}
