import {Doc}                                              from "./Interface";
import { IndexDescription, IndexSpecification, ObjectId } from "mongodb";

export class ClientDataSet {
    public fieldSets(): Array<keyof Doc> {
        return ["_id", "title", "owner"];
    }

    public indexes(): IndexDescription[] {
        return [
            {key: {title: 1}},
            {key: {owner: 1}},
        ];
    }

    public defaults(): Doc {
        return {
            _id: new ObjectId().toHexString(),
            title: undefined,
            owner: undefined,
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
