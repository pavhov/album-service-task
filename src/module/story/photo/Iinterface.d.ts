export namespace Photo {
	export namespace Request {
		export interface LoadPhoto {
			owner: string;
		}
	}
	export namespace Response {
		export interface LoadPhoto {
			count: number;
		}
	}
}
