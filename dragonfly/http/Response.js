import { Encoder, } from '../modules.deno.js';

export default class Response
{
	/**
	 * Construct a response (server-side)
	 * 
	 * @param 0.body     <mixed>
	 * @param 0.?status  <number>
	 * @param 0.?headers {}
	 */
	constructor( { body, status=200, headers={}, }, )
	{
		this.status= status;
		this.headers= new Headers( headers, );
		
		if( typeof body === 'string' )
		{
			this.body= Encoder.encode( body, );
			this.headers.set( 'Content-Length', this.body.length, )
		}
		else
			this.body= body;
	}
	
	/**
	 * Construct a HTML response
	 * 
	 * @param body       (string)
	 * @param 1.?status  <number>
	 * @param 1.?headers {}
	 */
	static newHTML( body, { status=200, }={}, )
	{
		const headers= {
			'Content-Type': 'text/html;charset=utf-8',
		};
		
		return new this( { status, body, headers, }, );
	}
}
