import { path, } from '../modules.deno.js';
import Route from './Route.js';
import Response from '../http/Response.js';

export default class Router
{
	/**
	 * @type (string)
	 */
	#controllerPath;
	
	/**
	 * @type []{Route}
	 */
	#routes;
	
	/**
	 * Consturct a router
	 * 
	 * @param 0.routes          {}[]
	 * @param 0.?controllerPath (string)
	 */
	constructor( { routes, controllerPath=defaultWebRoot(), }, )
	{
		this.#controllerPath=controllerPath;
		
		this.#routes= routes.map( route=> {
			if( typeof route.controller === 'string' )
				route.controller= controllerPath + route.controller;
			
			return new Route( route, );
		}, );
	}
	
	/**
	 * Dispatch a request to a route
	 * 
	 * @param request {Request}
	 * 
	 * @return {Route}
	 */
	dispatch( request, )
	{
		return this.#routes.reduce( ( result, route, )=> {
			const level= route.match( request, );
			
			if( level > result.level )
			{
				result.level= level;
				result.route= route;
			}
			
			return result;
		}, { level: 0, route: null, }, ).route;
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
	
	return `${path.dirname( file, )}/controllers`;
}
