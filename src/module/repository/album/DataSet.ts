import {Doc}                                              from "./Interface";
import { IndexDescription, IndexSpecification, ObjectId } from "mongodb";

/**
 * @name ClientDataSet
 */
export class ClientDataSet {
    /**
     * @name fieldSets
     */
    public fieldSets(): Array<keyof Doc> {
        return ["_id", "title", "owner"];
    }

    /**
     * @name indexes
     */
    public indexes(): IndexDescription[] {
        return [
            {key: {title: 1}},
            {key: {owner: 1}},
        ];
    }

    /**
     * @name defaults
     */
    public defaults(): Doc {
        return {
            _id: new ObjectId().toHexString(),
            title: undefined,
            owner: undefined,
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
