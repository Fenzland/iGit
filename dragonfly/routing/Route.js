import Response from '../http/Response.js';

export default class Route
{
	/**
	 * Construct a route
	 * 
	 * @param 0.path       (string)       exact path pattern
	 *                     {RegExp}       regexp path pattern, named groups for route params
	 * @param 0.?method    (string)       HTTP method
	 * @param 0.?accept    {AcceptArray}  HTTP accept
	 * @param 0.controller (string)       controller module path [dynamic], [recommanded].
	 *                     {Function}     built-in controller, generally for simple controllers.
	 */
	constructor( { path, method='*', accept='*/*', controller, }, )
	{
		this.path= path;
		this.method= method;
		this.accept= accept;
		this.controller= controller;
	}
	
	/**
	 * Match the request for a match level.
	 * 
	 * @param request {Request}
	 * 
	 * @return (number)  match level
	 */
	match( request, )
	{
		let level= 1;
		
		// Path: strict string match is prior to regexp match.
		level*= (
			this.path instanceof RegExp? 
			(this.path.test( request.path, )? 1: 0): 
			(this.path === request.path? 2: 0)
		);
		
		if( !level )
			return 0;
		
		// Method: strict match is prior to *.
		level*= this.method === '*'? 1: request.method === this.method? 2: 0;
		
		if( !level )
			return 0;
		
		// Accept: strict match is prior to *.
		level*= request.accept.match( this.accept, );
		
		if( !level )
			return 0;
		
		return level;
	}
	
	/**
	 * Run the route.
	 * 
	 * @param 0.request {Request}
	 * @param 0.app     {App}
	 * 
	 * @return {Response}
	 */
	async run( { request, app, }, )
	{
		let controller, responded;
		
		if( this.controller instanceof Function )
			controller= this.controller;
		else
		{
			const importing= import(this.controller).catch( e=> {
				throw new Error( `There is something wrong with controller [${this.controller}]:\n\n${e}`, );
			}, );
			
			controller= (await importing).default;
		}
		
		try
		{
			responded= await controller( { app, request, Response, }, );
		}
		catch( e )
		{
			responded= e;
		}
		
		if( responded instanceof Response )
			return responded;
		
		return this.makeResponse( responded, );
	}
	
	/**
	 * Make response depends on accept
	 * 
	 * @param responded <any>
	 * 
	 * @return {Response}
	 */
	makeResponse( responded, )
	{
		switch( this.accept )
		{
			default:
			case 'text/html':
				return Response.newHTML( `${responded}`, );
			break;
			
			case 'application/json':
				return new Response( {
					body: JSON.stringify( responded, ),
					headers: {
						'Content-Type': 'application/json',
					},
				}, );
			break;
			
			case 'text/javascript':
			case 'application/javascript':
				return new Response( {
					body: `${responded}`,
					headers: {
						'Content-Type': 'application/javascript',
					},
				}, );
			break;
		}
	}
}
