import {promisify} from "util";
import Bluebird from "bluebird";

const timeout = promisify(setTimeout);

export class CPromise<T> extends Bluebird<T> {
    static async retry<T>(call: () => Promise<T>, attempt: number): Promise<T> {
        let result;
        do {
            --attempt;
            try {
                result = await call();
                attempt = -1;
            } catch (err) {
                if (attempt === 0) {
                    throw err;
                }
                await timeout(1000);
            }
        } while (attempt >= 0);
        return result;
    }
}
