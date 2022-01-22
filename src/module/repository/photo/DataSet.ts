import {Doc}                          from "./Interface";
import { IndexDescription, ObjectId } from "mongodb";

export class ClientDataSet {
    public fieldSets(): Array<keyof Doc> {
        return ["_id", "owner", "albumId", "title", "url", "thumbnailUrl"];
    }

    public indexes(): IndexDescription[] {
        return [
            {key: {owner: 1}},
            {key: {albumId: 1}},
            {key: {title: 1}},
        ];
    }

    public defaults(): Doc {
        return {
            _id: new ObjectId().toHexString(),
            owner: undefined,
            albumId: undefined,
            title: undefined,
            url: undefined,
            thumbnailUrl: undefined,
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
