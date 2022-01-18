import {json5} from "../json5/Parser";
import configMap from "./Map";

const Params: any = {
    params: {} as any
};

/**
 * @name parse
 */
const parse = () => {
    for (let name in configMap) {
        if (configMap.hasOwnProperty(name)) {
            let config = configMap[name];
            merge(configMap, config, name);
        }
    }
};

/**
 * @name get
 * @param key
 */
const get = (key: string): string => {
    let {env} = process;
    if (env[key] !== undefined) {
        return env[key] || null;
    }
    return null;
};

/**
 * @name set
 * @param configs
 * @param name
 * @param joinedKey
 */
const set = (configs: any, name: string, joinedKey: string) => {
    let data = get(joinedKey);
    if (data) {
        configs[name] = json5.parse(data) || data;
    }
    Params.params[joinedKey] = configs[name];
};

/**
 * @name merge
 * @param configs
 * @param config
 * @param name
 * @param joinedKey
 */
const merge = (configs: any, config: any, name?: string, joinedKey?: string) => {
    joinedKey = joinedKey && `${joinedKey}_${name}` || name;
    if (typeof config === "object") {
        for (let subName in config) {
            if (config.hasOwnProperty(subName)) {
                let config = configs[name];
                set(configs, name, joinedKey);
                if (config) {
                    merge(configs[name], config[subName], subName, joinedKey);
                }
            }
        }
    } else if (typeof config !== "object") {
        set(configs, name, joinedKey);
    }
};

parse();

export default Params.params;
