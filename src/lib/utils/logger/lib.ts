import {IDebugger} from "debug";

import {json5} from "../json5/Parser";
import LoggerInterface from "./../../interfaces/Logger";
import Params from "./../../../lib/utils/config/Params";

const wd = process.cwd();

/**
 * @name lib
 * @param args
 */
const lib: IDebugger = (...args: any[]) => process.stdout.write(`${json5.stringify(args, null, 0)} \n`); // Debug("");

/**
 * @name Log
 * @param level
 * @constructor
 */
const Log = (level: LoggerInterface["level"]): LoggerInterface["Return"] => {
    const loglevel: any = Params.app_logging;
    return (...data: any[]): void => {
        const moduleFile = `${global.__module}:${global.__line}`;
        const message: any = (
            (loglevel === "error" && data instanceof Error && data) ||
            (
                (level === "warning" && loglevel === level && data.filter((value) => "warning" in value) && data) ||
                (loglevel === "debug" && [level, "debug", "error", "warning"].includes(loglevel) && data) ||
                (loglevel === "info" && [level, "error"].includes(loglevel) && [data[0]])
            )
        );
        if (message) {
            logMessage(level, moduleFile, message);
        }
    };
};

/**
 * @name logMessage
 * @param level
 * @param moduleFile
 * @param message
 */
const logMessage = (level: LoggerInterface["level"], moduleFile: string, message: any) => {
    let hasError = message[0] instanceof Error;
    let dateNow = new Date();
    let result: any;

    if (hasError) {
        level = "error";
        const stackSlice = message[0].stack.split("\n").map((val) => val.replace(wd, ""));
        const stack = json5.stringify(stackSlice.splice(1, 4)).
            replace(new RegExp(" {2}", "gmu"), "").
            replace(/\\/gu, "/").
            replace(/\/\//gu, "/");
        result = {
            name: message[0].name,
            message: message[0].message,
            stack
        };
    } else {
        result = message;
    }
    return lib({
        time: dateNow.toUTCString(),
        level,
        caller: moduleFile.replace(wd, "").replace(/\\/gu, "/"),
        message: result
    });
};

/**
 * @name error
 */
export const error = Log("error");

/**
 * @name warning
 */
export const warning = Log("warning");

/**
 * @name debug
 */
export const debug = Log("debug");

/**
 * @name info
 */
export const info = Log("info");
