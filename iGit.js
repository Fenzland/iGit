import './init.js';
import { color, } from './app/modules.deno.js';
import Args from './cli/Args.js';
import App from './dragonfly/App.js';
import router from './app/router.js';

(async args=> {
	args= new Args( ...args );
	
	const host= args.getOption( 'host', '0.0.0.0:8888', );
	
	const app= new App( {
		router,
	}, );
	
	app.listenHTTP( host, );
	
	console.log( `Listening: http://${host.replace( /0\.0\.0\.0:|^:/, 'localhost:', )}`, );
	console.log( 'Ctrl+C to quit.' );
	
})( Deno.args, ).catch( e=> {
	
	console.error( color.red( '\nThere is something wrong:\n', ), );
	console.error( e, );
	
	Deno.exit( 1, );
}, );
