import {Doc} from "./Interface";
import {IndexDescription, ObjectId} from "mongodb";

/**
 * @name ClientDataSet
 */
export class ClientDataSet {

    /**
     * @name fieldSets
     */
    public fieldSets(): Array<keyof Doc> {
        return ["_id", "owner", "albumId", "title", "url", "thumbnailUrl"];
    }

    /**
     * @name indexes
     */
    public indexes(): IndexDescription[] {
        return [
            {key: {owner: 1}},
            {key: {albumId: 1}},
            {key: {title: 1}}
        ];
    }

    /**
     * @name defaults
     */
    public defaults(): Doc {
        return {
            _id: new ObjectId().toHexString(),
            owner: undefined,
            albumId: undefined,
            title: undefined,
            url: undefined,
            thumbnailUrl: undefined
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
