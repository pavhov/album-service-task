import ___                 from "lodash";
import fetch               from "node-fetch";
import objectid                       from "objectid";
import { DeleteResult, UpdateResult } from "mongodb";
import PhotoTask                      from "../../repository/photo/Task";
import { Photo }                      from "./Iinterface";
import { Doc as AlbumDoc }            from "../../repository/album/Interface";
import { Doc as PhotoDoc }            from "../../repository/photo/Interface";
import AlbumTask                      from "../../repository/album/Task";
import { Promise }                    from "../../../lib/utils/promise";

/**
 * @name PhotoStory
 */
export class PhotoStory {

	/**
	 * @name tasks
	 */
	public tasks: {
		Photo: PhotoTask;
		Album: AlbumTask;
	};

	/**
	 * @name PhotoStory
	 */
	constructor() {
		this.tasks = {
			Photo: PhotoTask.Instance(),
			Album: AlbumTask.Instance(),
		};
	}

	/**
	 * @name load
	 *
	 * @param data
	 */
	public async load(data: Photo.Request.LoadPhoto): Promise<Photo.Response.LoadPhoto> {
		const res = <any>await (await Promise.retry(() => fetch("https://jsonplaceholder.typicode.com/photos"), 3)).json();
		const groupByData = ___.groupBy(res, "albumId") as unknown as { [key: string]: any[] };
		const [albums, photos] = this.buildAlbumWithPhoto(data, groupByData);
		const ares = await this.tasks.Album.createMany(albums);
		const pres = await this.tasks.Photo.createMany(photos);
		return {count: res?.length, albums: ares.insertedIds, photos: pres.insertedIds};
	}

	/**
	 * @name get
	 *
	 * @param data
	 */
	public async get(data: Photo.Request.PhotoPagination): Promise<Photo.Response.Photo[]> {
		return this.tasks.Photo.getList({owner: data.ownerid}, {skip: data.page * data.maxcount, limit: data.maxcount});
	}

	/**
	 * @name delete
	 *
	 * @param data
	 */
	public async delete(data: Photo.Request.DeletePhoto): Promise<DeleteResult> {
		return this.tasks.Photo.removeMany({
			_id: {$in: data.photoid as string[]},
			owner: data.owner,
		});
	}

	/**
	 * @name deleteAlbum
	 *
	 * @param data
	 */
	public async deleteAlbum(data: Photo.Request.DeleteAlbum): Promise<DeleteResult[]> {
		const session = this.tasks.Album.session();
		session.startTransaction();
		try {
			const res = await Promise.all([
				this.tasks.Album.removeMany({
					_id: {$in: (data.albumid as string[]).map(value => objectid(value))},
					owner: data.owner,
				}, {session}),
				this.tasks.Photo.removeMany({
					albumId: {$in: data.albumid as string[]},
					owner: data.owner,
				}, {session})
			]);
			await session.commitTransaction();
			await session.endSession();
			return res;
		} catch (e) {
			await session.abortTransaction();
			await session.endSession();
			throw e;
		}
	}

	/**
	 * @name updateAlbum
	 *
	 * @param data
	 */
	public async updateAlbum(data: Photo.Request.UpdateAlbum): Promise<UpdateResult> {
		return this.tasks.Album.updateOne({_id: objectid(data.albumid)}, {$set: {title: data.new_album_name}});
	}

	/**
	 * @name buildAlbumWithPhoto
	 *
	 * @param data
	 * @param groupByData
	 * @private
	 */
	private buildAlbumWithPhoto(data, groupByData): [albums: AlbumDoc[], photos: PhotoDoc[]] {
		const [albums, photos] = [[] as AlbumDoc[], [] as PhotoDoc[]];
		Object.keys(groupByData).forEach((albumId: string) => {
			const objectId = objectid();
			albums.push({
				_id: objectId,
				owner: data.owner,
				title: `Album ${albumId}`,
			});
			groupByData[albumId].forEach((val) => photos.push({
				albumId: objectId.toString(),
				owner: data.owner,
				title: val.title,
				url: val.url,
				thumbnailUrl: val.thumbnailUrl,
			}));
		});
		return [albums, photos];
	}
}
