import {Doc} from "./Interface";
import {IndexSpecification, ObjectId} from "mongodb";

export class ClientDataSet {
    public fieldSets(): Array<keyof Doc> {
        return ["_id", "apiKey", "apiSecret", "status", "type"];
    }

    public indexes(): IndexSpecification[] {
        return [
            // {key: {apiKey: 1}, unique: true},
            // {key: {apiSecret: 1}, unique: true},
            // {key: {status: 1}}, {key: {type: 1}}
        ];
    }

    public defaults(): Doc {
        return {
            _id: new ObjectId().toHexString(),
            apiKey: undefined,
            apiSecret: undefined,
            status: undefined,
            type: "unknown"
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
