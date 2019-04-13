import { path, } from '../packages.js';
import Route from './Route.js';
import Response from '../http/Response.js';

export default class Router
{
	/**
	 * Consturct a router
	 * 
	 * @param 0.routes          {}[]
	 * @param 0.?controllerPath (string)
	 */
	constructor( { routes, controllerPath=defaultWebRoot(), }, )
	{
		this.controllerPath=controllerPath;
		
		this.routes= routes.map( route=> {
			if( typeof route.controller === 'string' )
				route.controller= controllerPath + route.controller;
			
			return new Route( route, );
		}, );
		
		this.failback= new Route( {
			controller: ()=> Response.newHTML( 'Not Found', { status: 404, }, ),
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
		return this.routes[0];
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
