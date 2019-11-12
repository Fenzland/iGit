import { httpServer, path, file_exists, } from './modules.deno.js';
import { file_length, read_file, is_file, } from './utils/fs.js';
import Request from './http/Request.js';
import Response from './http/Response.js';
import { ext2mime, } from './http/mime.js';
import notFound from './routing/not-found.js';

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
	async listenHTTP( host, { concurrency=1024, }={}, )
	{
		let listening= 0;
		
		const listen= async ( server, )=> {
			++listening;
			
			const { value, done, }= await server.next();
			
			--listening;
			
			if( done )
				return;
			
			handle( value, );
		};
		
		const handle= async ( denoRequest, )=> {
			const request= new Request( denoRequest, );
			
			const route= this.#router.dispatch( request, );
			
			if( route )
			{
				const response= await route.run( { request, app:this, }, );
				
				denoRequest.respond( response, );
			}
			else
			if( await this.hasFile( request.path, ) )
			{
				const path= `${this.#webRoot}${request.path}`;
				
				denoRequest.respond( await makeFileResponse( path, ), );
			}
			else
				denoRequest.respond( await notFound( { request, app:this, }, ), );
		};
		
		const server= httpServer.serve( host, )[Symbol.asyncIterator]();
		
		while( true )
		{
			if( listening < concurrency )
				listen( server, );
			else
				await timeout();
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
	
	const $content= read_file( path, { asText:false, }, );
	const $length= file_length( path, );
	
	return new Response( {
		body: await $content,
		status: 200,
		headers: {
			'Content-Type': mime,
			'Content-Length': await $length,
			'Access-Control-Allow-Origin': '*',
		},
	}, );
}
