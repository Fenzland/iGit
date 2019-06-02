import './init.js';
import { color, } from './app/modules.deno.js';
import Args from './cli/Args.js';
import App from './dragonfly/App.js';
import router from './app/router.js';

(async args=> {
	args= new Args( ...args );
	
	const host= args.getOption( 'host', '0.0.0.0:8192', );
	
	const app= new App( {
		router,
		webRoot: import.meta.url.replace( /^file:\/\/|\/iGit\.js$/g, '', ).replace( /\/([A-Z]:\/)/, '$1', ),
	}, );
	
	app.listenHTTP( host, );
	
	console.log( `Listening: http://${host.replace( /0\.0\.0\.0:|^:/, 'localhost:', )}`, );
	console.log( 'Ctrl+C to quit.' );
	
})( Deno.args, ).catch( e=> {
	
	console.error( color.red( 'Error:', ), );
	console.error( color.bgRed( ` ${e.message} `, ), );
	console.error( e.stack, );
	
	Deno.exit( e.code|| 1, );
}, );
