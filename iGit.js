import './init.js';
import Args from './cli/Args.js';
import App from './dragonfly/App.js';

(async args=> {
	args= new Args( ...args );
	
	const host= args.getOption( 'host', '0.0.0.0:8888', );
	
	const app= new App();
	
	app.listenHTTP( host, );
	
})();
