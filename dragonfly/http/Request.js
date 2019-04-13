import Query from './Query.js';

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
		
		const [ path, ...query ]= this.url.split( /\?|&/, );
		
		this.path= path;
		this.query= new Query( query.length? query[0]: '', );
	}
}
