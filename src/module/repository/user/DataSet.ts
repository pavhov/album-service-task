import {Doc}                                              from "./Interface";
import { IndexDescription, ObjectId } from "mongodb";

export class ClientDataSet {
    /**
     * @name fieldSets
     */
    public fieldSets(): Array<keyof Doc> {
        return ["_id", "login", "email", "password", "registerDate"];
    }

    /**
     * @name indexes
     */
    public indexes(): IndexDescription[] {
        return [
            {key: {login: 1}, unique: true},
            {key: {email: 1}, unique: true},
        ];
    }

    /**
     * @defaults
     */
    public defaults(): Doc {
        return {
            _id: new ObjectId().toHexString(),
            login: undefined,
            email: undefined,
            password: undefined,
            registerDate: undefined,
        };
    }

    /**
     * @name dataSet
     *
     * @param data
     */
    public dataSet(data: Doc) {
        const [result, fieldSets] = [this.defaults(), this.fieldSets()];
        for (const field of fieldSets) {
            if (field in data) {
                result[field] = data[field];
            }
        }
        return result;
    }

    /**
     * @name dataSets
     *
     * @param data
     */
    public dataSets(data: Doc[]) {
        return data.map((value) => this.dataSet(value));
    }
}
