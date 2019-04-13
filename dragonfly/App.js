import { httpServer, path, } from './modules.deno.js';
import Request from './http/Request.js';
import Response from './http/Response.js';

/**
 * main Application class of Dragonfly
 */
export default class App
{
	/**
	 * Construct app
	 * 
	 * @param 0.router  {Router}
	 * @param 0.webRoot (string)
	 */
	constructor( { router, webRoot=defaultWebRoot(), }, )
	{
		this.router= router;
		this.webRoot= webRoot;
	}
	
	/**
	 * Listen a host with HTTP
	 * 
	 * @param host (string)
	 * 
	 * @return ~<void>
	 */
	async listenHTTP( host, )
	{
		for await( const denoRequest of httpServer.serve( host, ) )
		{
			const request= new Request( denoRequest, );
			
			const route= this.router.dispatch( request, );
			
			const response= await route.run( request, );
			
			denoRequest.respond( response, );
		}
	}
}

/**
 * Generate the default web root
 * 
 * @return (string)
 */
function defaultWebRoot()
{
	const file= path.traceBack( 2, );
	
	return path.dirname( file, ).replace( /^file:\/\//, '', );
}
