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
	 * @type {Map}
	 */
	#identifications= new Map();
	
	/**
	 * Consturct a router
	 * 
	 * @param 0.routes          {}[]
	 * @param 0.?controllerPath (string)
	 */
	constructor( { routes, controllerPath=defaultWebRoot(), }, )
	{
		this.#controllerPath=controllerPath;
		
		this.#routes= routes.map( meta=> {
			if( typeof meta.controller === 'string' )
				meta.controller= controllerPath + meta.controller;
			
			const route= new Route( meta, );
			
			if( meta.identifier )
				this.#identifications.set( identifier, route, );
			
			return route;
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
	
	/**
	 * Get a route by identifier
	 * 
	 * @param identifier <mixed>
	 */
	getRoute( identifier, )
	{
		return this.#identifications.get( identifier, );
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
