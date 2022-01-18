import Ajv from "ajv";

const ajv = new Ajv({
    allErrors: true,
    strictTypes: true,
    strictTuples: true,
    removeAdditional: true,
    strict: true
    // Logger: (debug() as unknown) as Logger
});

export default ajv;
