import { Encoder, } from '../../app/modules.js';

export default class CliError extends Error
{
	/**
	 * Error code that cli command returns
	 */
	#code;
	
	/**
	 * Construct a cli error
	 * 
	 * @param code    (number)
	 * @param message (string)
	 */
	constructor( code, message, )
	{
		super( Encoder.decode( message, ), );
		
		this.#code= code;
	}
	
	/**
	 * Get the error code
	 * 
	 * @return (number)
	 */
	get code()
	{
		return this.#code;
	}
}
