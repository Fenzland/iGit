import Router from '../dragonfly/routing/Router.js';
import home from './controllers/home.js';

export default new Router( {
	controllerPath: import.meta.url.replace( /router\.js$/, 'controllers/', ),
	routes: [
		{
			path: '/',
			method: 'GET',
			accept: 'text/html',
			// controller: 'home.js',
			controller: home,
		},
		
		{
			path: '/refs',
			method: 'GET',
			accept: 'application/json',
			controller: async ( { app, Response, }, )=> Response.newJSON( await app.git.getRefs(), ),
		},
		
		{
			path: '/graph',
			method: 'GET',
			accept: 'application/json',
			controller: async ( { app, request, Response, }, )=> Response.newJSON( await app.git.getGraph( request.query.get( 'start', 0, ), request.query.get( 'size', 0x40, ), ), ),
		},
		
		{
			path: '/changed-files',
			method: 'GET',
			accept: 'application/json',
			controller: async ( { app, Response, }, )=> Response.newJSON( await app.git.getIndex(), ),
		},
		
		{
			path: '/diff-index',
			method: 'GET',
			accept: 'application/json',
			controller: async ( { app, request, Response, }, )=> Response.newJSON( await app.git.diffIndex( ...request.query.get( 'files[]', ), ), ),
		},
		
	],
}, );
