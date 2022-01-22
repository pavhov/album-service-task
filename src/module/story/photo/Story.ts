import PhotoTask from "../../repository/photo/Task";
import { Photo } from "./Iinterface";
import fetch     from "node-fetch";

console.log(fetch);

/**
 * @name PhotoStory
 */
export class PhotoStory {

	/**
	 * @name tasks
	 */
	public tasks: {
		Photo: PhotoTask;
	};

	/**
	 * @name PhotoStory
	 */
	constructor() {
		this.tasks = {
			Photo: PhotoTask.Instance(),
		};
	}

	public async load(data: Photo.Request.LoadPhoto): Promise<Photo.Response.LoadPhoto> {
		const res = await (await fetch("https://jsonplaceholder.typicode.com/photos")).json();
		return {count: 1}
	}
}
