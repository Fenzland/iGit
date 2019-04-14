import Router from '../dragonfly/routing/Router.js';

import index from './controllers/index.js';

export default new Router( {
	controllerPath: import.meta.url.replace( /router\.js$/, 'controllers/', ),
	routes: [
		{
			path: '/',
			method: 'GET',
			accept: 'text/html',
			// controller: 'index.js',
			controller: index,
		},
	],
}, );