import {Doc} from "../../repository/photo/Interface";

export namespace Photo {
	export namespace Request {
		export interface LoadPhoto {
			owner: string;
		}
		export interface DeletePhoto {
			owner: string;
			photoid: string | string[];
		}
		export interface DeleteAlbum {
			owner: string;
			albumid: string | string[];
		}
		export interface DeleteAlbum {
			owner: string;
			albumid: string | string[];
		}
		export interface UpdateAlbum {
			albumid: string;
			new_album_name: string;
		}
		export interface PhotoPagination {
			ownerid: string;
			page: number;
			maxcount: number;
		}
	}
	export namespace Response {
		export interface LoadPhoto {
			count: number;
			albums: any;
			photos: any;
		}
		export type Photo = Doc
	}
}
