import {Doc}                                              from "./Interface";
import { IndexDescription, IndexSpecification, ObjectId } from "mongodb";
import { numParts }                                       from "npm-check-updates/build/src/version-util";

export class ClientDataSet {
    public fieldSets(): Array<keyof Doc> {
        return ["_id", "login", "email", "password", "registerDate"];
    }

    public indexes(): IndexDescription[] {
        return [
            {key: {login: 1}, unique: true},
            {key: {email: 1}, unique: true},
        ];
    }

    public defaults(): Doc {
        return {
            _id: new ObjectId().toHexString(),
            login: undefined,
            email: undefined,
            password: undefined,
            registerDate: undefined,
        };
    }

    public dataSet(data: Doc) {
        const [result, fieldSets] = [this.defaults(), this.fieldSets()];
        for (const field of fieldSets) {
            if (field in data) {
                result[field] = data[field];
            }
        }
        return result;
    }

    public dataSets(data: Doc[]) {
        return data.map((value) => this.dataSet(value));
    }
}
