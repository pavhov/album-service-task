import {
    BulkWriteOptions,
    Collection,
    Db,
    DeleteOptions,
    Filter,
    FindOptions,
    InsertOneOptions,
    MongoClient,
    OptionalUnlessRequiredId,
    UpdateFilter,
    UpdateOptions
} from "mongodb";

import {DBModule} from "../../../lib/decorators/DBModul";
import DBStory from "./../../../lib/abstract/DBStory";

import {ClientDataSet} from "./DataSet";
import {Doc} from "./Interface";
import Params from "../../../lib/utils/config/Params";

/**
 * @name PhotoTask
 */
@DBModule("mongo")
export default class PhotoTask extends DBStory {

    /**
	 * @name _instance
	 * @private
	 */
    private static _instance: PhotoTask;

    /**
	 * @name _dataSet
	 * @protected
	 */
    protected _dataSet: ClientDataSet;

    /**
	 * @name _dataSours
	 * @protected
	 */
    protected _dataSours: Collection<Doc>;

    /**
	 * @name PhotoTask
	 */
    constructor() {
        super();
        this._dataSet = new ClientDataSet();
    }

    /**
	 * @name Instance
	 * @constructor
	 */
    static Instance(): PhotoTask {
        if (!PhotoTask._instance) {
            PhotoTask._instance = new PhotoTask();
        }

        return PhotoTask._instance;
    }

    /**
	 * @name getOne
	 * @param filter
	 * @param options
	 */
    public getOne<T extends Doc>(filter: Filter<T>, options?: FindOptions<T>): Promise<Doc | undefined> {
        return this._dataSours.findOne<Doc>(filter, options);
    }

    /**
	 * @name getList
	 * @param query
	 * @param options
	 */
    public getList(query: Filter<Doc>, options?: FindOptions<Doc>): Promise<Doc[]> {
        return this._dataSours.find(query, options).toArray();
    }

    /**
	 * @name updateOne
	 * @param filter
	 * @param update
	 * @param options
	 */
    public updateOne(filter: Filter<Doc>, update: UpdateFilter<Doc> | Partial<Doc>, options?: UpdateOptions) {
        return this._dataSours.updateOne(filter, update, options);
    }

    /**
	 * @name updateMany
	 * @param filter
	 * @param update
	 * @param options
	 */
    public updateMany(filter: Filter<Doc>, update: UpdateFilter<Doc>, options?: UpdateOptions) {
        return this._dataSours.updateMany(filter, update, options);
    }

    /**
	 * @name createOne
	 * @param docs
	 * @param options
	 */
    public createOne(docs: OptionalUnlessRequiredId<Doc>, options?: InsertOneOptions) {
        return this._dataSours.insertOne(this._dataSet.dataSet(docs) as any, options);
    }

    /**
	 * @name createMany
	 * @param docs
	 * @param options
	 */
    public createMany(docs: OptionalUnlessRequiredId<Doc>[], options?: BulkWriteOptions) {
        return this._dataSours.insertMany(this._dataSet.dataSets(docs) as any, options);
    }

    /**
	 * @name removeMany
	 * @param filter
	 * @param options
	 */
    public removeOne(filter: Filter<Doc>, options?: DeleteOptions) {
        return this._dataSours.deleteOne(filter, options);
    }

    /**
	 * @name removeMany
	 * @param filter
	 * @param options
	 */
    public removeMany(filter: Filter<Doc>, options?: DeleteOptions) {
        return this._dataSours.deleteMany(filter, options);
    }

    /**
	 * @name init
	 * @protected
	 */
    public async init(dataSours: MongoClient) {
        const db: Db = dataSours.db(Params.db.mongo.albumStore.dbName);
        this._dataSours = db.collection(Params.db.mongo.albumStore.schemas.photo);
        await this.indexing();
        await this.rules(db);
    }

    /**
	 * @name init
	 * @protected
	 */
    public async indexing() {
        await this._dataSours.createIndexes(this._dataSet.indexes());
    }

    /**
	 * @name rules
	 * @protected
	 */
    public async rules(db: Db) {
        await db.command({
            collMod: Params.db.mongo.albumStore.schemas.photo,
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    properties: {
                        owner: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        albumId: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        title: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        url: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        thumbnailUrl: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    },
                    required: ["owner", "albumId", "title", "url", "thumbnailUrl"]
                }
            },
            validationLevel: "moderate"
        });
    }
}
