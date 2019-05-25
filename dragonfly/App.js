import { httpServer, path, file_exists, } from './modules.deno.js';
import Request from './http/Request.js';
import Response from './http/Response.js';
import { ext2mime, } from './http/mime.js';

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
			
			if( await this.hasFile( request.path, ) )
			{
				const path= `${this.webRoot}${request.path}`;
				
				denoRequest.respond( await makeFileResponse( path, ), );
				
				continue;
			}
			
			const route= this.router.dispatch( request, );
			
			const response= await route.run( request, );
			
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
		path= `${this.webRoot}${path}`;
		
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
 * Check whether a file is a file (not directory or symbol link).
 * 
 * @param path (string)
 * 
 * @return ~(boolean)
 */
async function is_file( path, )
{
	return (await Deno.stat( path, )).isFile();
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
	
	const file= Deno.open( path, );
	const stat= Deno.stat( path, );
	
	return new Response( {
		body: await file,
		status: 200,
		headers: {
			'Content-Type': mime,
			'Content-Length': (await stat).len,
		},
	}, );
}
