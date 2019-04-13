import Route from './Route.js';

export default class Router
{
	/**
	 * Consturct a router
	 * 
	 * @param 0.routes          {}[]
	 */
	constructor( { routes, }, )
	{
		this.routes= routes.map( route=> new Route( route, ), );
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
