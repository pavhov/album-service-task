import ___                 from "lodash";
import fetch               from "node-fetch";
import objectid            from "objectid";
import PhotoTask           from "../../repository/photo/Task";
import { Photo }           from "./Iinterface";
import { Doc as AlbumDoc } from "../../repository/album/Interface";
import { Doc as PhotoDoc } from "../../repository/photo/Interface";
import AlbumTask           from "../../repository/album/Task";

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

	public async load(data: Photo.Request.LoadPhoto): Promise<Photo.Response.LoadPhoto> {
		const res = await (await fetch("https://jsonplaceholder.typicode.com/photos")).json();
		const groupByData = ___.groupBy(res, "albumId") as unknown as {[key: string]: any[]};
		const [albums, photos] = this.buildAlbumWithPhoto(data, groupByData);
		const ares = await this.tasks.Album.createMany(albums);
		const pres = await this.tasks.Photo.createMany(photos);
		return {count: res?.length, albums: ares.insertedIds, photos: pres.insertedIds};
	}

	public async get() {}

	public async delete() {}

	private buildAlbumWithPhoto(data, groupByData): [albums: AlbumDoc[], photos: PhotoDoc[]] {
		const [albums, photos] = [[] as AlbumDoc[], [] as PhotoDoc[] ];
		Object.keys(groupByData).forEach((albumId: string) => {
			const objectId = objectid()
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
		})
		return [albums, photos];
	}
}
