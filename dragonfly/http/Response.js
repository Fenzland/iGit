
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
			this.body= new TextEncoder().encode( body, );
			this.headers.set( 'Content-Length', this.body.length, )
		}
		else
			this.body= body;
	}
}
