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
 * @name AlbumTask
 */
@DBModule("mongo")
export default class AlbumTask extends DBStory {

    /**
	 * @name _instance
	 * @private
	 */
    private static _instance: AlbumTask;

    /**
	 * @name _dataSet
	 * @protected
	 */
    protected _dataSet: ClientDataSet;

    /**
	 * @name _dateSours
	 * @protected
	 */
    protected _dateSours: MongoClient;

    /**
	 * @name _collectionSours
	 * @protected
	 */
    protected _collectionSours: Collection<Doc>;

    /**
	 * @name AlbumTask
	 */
    constructor() {
        super();
        this._dataSet = new ClientDataSet();
    }

    /**
	 * @name Instance
	 * @constructor
	 */
    static Instance(): AlbumTask {
        if (!AlbumTask._instance) {
            AlbumTask._instance = new AlbumTask();
        }

        return AlbumTask._instance;
    }

    /**
	 * @name getOne
	 * @param filter
	 * @param options
	 */
    public getOne<T extends Doc>(filter: Filter<T>, options?: FindOptions<T>): Promise<Doc | undefined> {
        return this._collectionSours.findOne<Doc>(filter, options);
    }

    /**
	 * @name getList
	 * @param query
	 * @param options
	 */
    public getList(query: Filter<Doc>, options?: FindOptions<Doc>): Promise<Doc[]> {
        return this._collectionSours.find(query, options).toArray();
    }

    /**
	 * @name updateOne
	 * @param filter
	 * @param update
	 * @param options
	 */
    public updateOne(filter: Filter<Doc>, update: UpdateFilter<Doc> | Partial<Doc>, options?: UpdateOptions) {
        return this._collectionSours.updateOne(filter, update, options);
    }

    /**
	 * @name updateMany
	 * @param filter
	 * @param update
	 * @param options
	 */
    public updateMany(filter: Filter<Doc>, update: UpdateFilter<Doc>, options?: UpdateOptions) {
        return this._collectionSours.updateMany(filter, update, options);
    }

    /**
	 * @name createOne
	 * @param docs
	 * @param options
	 */
    public createOne(docs: OptionalUnlessRequiredId<Doc>, options?: InsertOneOptions) {
        return this._collectionSours.insertOne(this._dataSet.dataSet(docs) as any, options);
    }

    /**
	 * @name createMany
	 * @param docs
	 * @param options
	 */
    public createMany(docs: OptionalUnlessRequiredId<Doc>[], options?: BulkWriteOptions) {
        return this._collectionSours.insertMany(this._dataSet.dataSets(docs) as any, options);
    }

    /**
	 * @name removeMany
	 * @param filter
	 * @param options
	 */
    public removeMany(filter: Filter<Doc>, options?: DeleteOptions) {
        return this._collectionSours.deleteMany(filter, options);
    }

    public session() {
        return this._dateSours.startSession({
            defaultTransactionOptions: {
                readConcern: {level: "local"},
                writeConcern: {w: "majority"}
            }
        });
    }

    /**
	 * @name init
	 * @protected
	 */
    public async init(dataSours: MongoClient) {
        const db: Db = dataSours.db(Params.db.mongo.albumStore.dbName);
        this._dateSours = dataSours;
        this._collectionSours = db.collection(Params.db.mongo.albumStore.schemas.album);
        await this.indexing();
        await this.rules(db);
    }

    /**
	 * @name init
	 * @protected
	 */
    public async indexing() {
        await this._collectionSours.createIndexes(this._dataSet.indexes());
    }

    /**
	 * @name rules
	 * @protected
	 */
    public async rules(db: Db) {
        await db.command({
            collMod: Params.db.mongo.albumStore.schemas.album,
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    properties: {
                        title: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        owner: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    },
                    required: ["title", "owner"]
                }
            },
            validationLevel: "moderate"
        });
    }
}
