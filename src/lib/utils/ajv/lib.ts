import Ajv, { Logger } from "ajv";
import addFormats from "ajv-formats"
import * as logger from "../logger/lib";

const ajv = new Ajv({
    allErrors: true,
    strictTypes: true,
    strictTuples: true,
    removeAdditional: true,
    strict: false,
    logger,
});

addFormats(ajv)

export default ajv;
