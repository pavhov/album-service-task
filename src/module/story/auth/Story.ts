import md5                from "md5";
import * as JWT           from "jsonwebtoken";
import UserTask           from "../../repository/user/Task";
import { Doc as UserDoc } from "../../repository/user/Interface";
import { Auth }           from "./Iinterface";
import Params             from "../../../lib/utils/config/Params";

/**
 * @name ClientStory
 */
export class AuthStory {

	/**
	 * @name tasks
	 */
	public tasks: {
		User: UserTask;
	};

	/**
	 * @name ClientStory
	 */
	constructor() {
		this.tasks = {
			User: UserTask.Instance()
		};
	}

	/**
	 * @name login
	 *
	 * @param data
	 */
	public async login(data: Auth.Request.Login): Promise<Auth.Response.Login> {
		try {
			const res = await this.tasks.User.getOne({
				$or: [
					{email: data.email},
					{login: data.login},
				]
			});
			if (!res) {
				throw new Error(`User '${(data.email || data.login)}' not found`);
			}
			if (md5(data.password) !== res.password) {
				throw new Error(`User '${(data.email || data.login)}' password is wrong`);
			}

			return this.token(res);
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 * @name register
	 *
	 * @param data
	 */
	public async register(data: Auth.Request.Register) {
		const res = await this.tasks.User.getOne({
			$or: [
				{email: data.email},
				{login: data.login},
			]
		});
		!res && await this.tasks.User.createOne({...data, password: md5(data.password), registerDate: new Date().toISOString()});
		return this.login(data);
	}

	/**
	 * @name bearer
	 *
	 * @param data
	 */
	public async bearer(data: Auth.Request.Barer): Promise<Auth.Response.Barer> {
		const res = JWT.verify(data.authorization, Params.jwt.secret);
		const user = await this.tasks.User.getOne({_id: res.user});
		if (!user) {
			throw new Error("Wrong token");
		}
		return {owner: user._id}


	}

	/**
	 * @name token
	 *
	 * @param res
	 * @private
	 */
	private token(res: UserDoc) {
		return {type: "Barer", token: JWT.sign({user: res._id}, Params.jwt.secret, Params.jwt.options)};
	}
}
