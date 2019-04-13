
export default class Request
{
	/**
	 * Construct a HTTP request (server-side)
	 * 
	 * @param denoRequest ServerRequest
	 */
	constructor( denoRequest, )
	{
		this.url= denoRequest.url;
		this.method= denoRequest.method;
		this.headers= denoRequest.headers;
	}
}
