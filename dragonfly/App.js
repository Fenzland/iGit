import { httpServer, path, file_exists, } from './modules.deno.js';
import { file_length, read_file, is_file, } from './utils/fs.js';
import Request from './http/Request.js';
import Response from './http/Response.js';
import { ext2mime, } from './http/mime.js';

/**
 * main Application class of Dragonfly
 */
export default class App
{
	/**
	 * @type {Router}
	 */
	#router;
	
	/**
	 * @type (string)
	 */
	#webRoot;
	
	/**
	 * Construct app
	 * 
	 * @param 0.router  {Router}
	 * @param 0.webRoot (string)
	 */
	constructor( { router, webRoot=defaultWebRoot(), }, )
	{
		this.#router= router;
		this.#webRoot= webRoot;
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
			
			if( await this.hasFile( request.path, ) )
			{
				const path= `${this.#webRoot}${request.path}`;
				
				denoRequest.respond( await makeFileResponse( path, ), );
				
				continue;
			}
			
			const route= this.#router.dispatch( request, );
			
			const response= await route.run( { request, app: this, }, );
			
			denoRequest.respond( response, );
		}
	}
	
	/**
	 * Check whether a file exists in web root.
	 * 
	 * @param path (string)
	 * 
	 * @return ~(boolean)
	 */
	async hasFile( path, )
	{
		path= `${this.#webRoot}${path}`;
		
		return (await file_exists( path, )) && (await is_file( path, ));
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
	
	return path.dirname( file, ).replace( /^file:\/\//, '', ).replace( /\/([A-Z]:\/)/, '$1', );
}

/**
 * Make file response
 * 
 * @access private
 * 
 * @param path (string)
 * 
 * @return ~{Response}
 */
async function makeFileResponse( path, )
{
	const ext= (x=> x? x[0]: '')( path.match( /\.\w+$/, ), );
	const mime= ext2mime( ext, ) || 'text/plain';
	
	const $content= read_file( path, );
	const $length= file_length( path, );
	
	return new Response( {
		body: await $content,
		status: 200,
		headers: {
			'Content-Type': mime,
			'Content-Length': await $length,
		},
	}, );
}
