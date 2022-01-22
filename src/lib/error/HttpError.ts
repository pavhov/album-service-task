import ___ from "lodash";

/**
 * @name HttpError
 */
export default class HttpError extends Error {

	/**
	 * @name _name
	 * @private
	 */
	private readonly _name: string;

	/**
	 * @name _message
	 * @private
	 */
	private readonly _message: string;

	/**
	 * @name _code
	 * @private
	 */
	private readonly _code: number | string;

	/**
	 * @name _errors
	 * @private
	 */
	private readonly _errors: any[];

	/**
	 * @name HttpError
	 * @param message
	 * @param code
	 * @param errors
	 */
	constructor(message: any, code: number | string, errors?: any[]) {
		super();

		this._name = "HttpError";
		this._code = code;
		this._message = message;
		this._errors = errors;
		this.message = this.toString();

		Error.captureStackTrace(this, this.constructor);

	}

	/**
	 * @name toString
	 */
	public toString() {
		return JSON.stringify(this.toJSON());
	}

	/**
	 * @name toJSON
	 */
	public toJSON() {
		return {
			success: false,
			error: {
				name: this._name,
				code: this._code,
				message: this._message,
				errors: this._errors?.map(value => ___.omit(value, ["schemaPath", "instancePath"])),
			}
		};
	}
}
