export namespace Auth {
	export namespace Request {
		export interface Login {
			login: string;
			email: string;
			password: string;
		}

		export interface Register {
			login: string;
			email: string;
			password: string;
			registerDate: string;
		}
	}
	export namespace Response {
		export interface Login {
			type: string;
			token: string;
		}

		export interface Register {
			type: string;
			token: string;
		}
	}
}
