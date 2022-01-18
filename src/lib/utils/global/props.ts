import "reflect-metadata";

declare global {
    namespace NodeJS {
        interface Global {
            __stack: NodeJS.CallSite[];
            __line: number | null;
            __module: number | null;
            __function: number | null;
        }
    }
}

/**
 * @name stack
 */
const stack = function (): string {
    let orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (___, stack) {
        return stack;
    };
    let err = new Error();

    Error.captureStackTrace(err, err as any);
    let {stack} = err;
    Error.prepareStackTrace = orig;
    return stack;
};

/**
 * @name line
 */
const line = function (): number | null {
    return global.__stack[3].getLineNumber();
};

/**
 * @name moduleFn
 */
const moduleFn = function (): string | null {
    return global.__stack[3].getFileName();
};

/**
 * @name functionFn
 */
const functionFn = function (): string | null {
    return global.__stack[3].getFunctionName();
};

Object.defineProperty(global, "__stack", {get: stack});

Object.defineProperty(global, "__line", {get: line});

Object.defineProperty(global, "__module", {get: moduleFn});

Object.defineProperty(global, "__function", {get: functionFn});
