import Ajv from "ajv";
import addFormats from "ajv-formats"
import * as logger from "../logger/lib";

const ajv = new Ajv({
    allErrors: true,
    strictTypes: true,
    strictTuples: true,
    coerceTypes: true,
    removeAdditional: true,
    strict: false,
    logger
});

addFormats(ajv)

ajv.addFormat("coma-seperated", "^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$");

export default ajv;
