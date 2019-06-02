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
	],
}, );
