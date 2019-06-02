import './init.js';
import { color, } from './app/modules.deno.js';
import Args from './cli/Args.js';
import Git from './git/Git.js';
import App from './dragonfly/App.js';
import router from './app/router.js';
import { renderHelp, renderVersion, } from './app/command-helpers.js';

(async args=> {
	args= new Args( ...args );
	
	if( args.hasOption( 'help', ) )
		return renderHelp();
	else
	if( args.hasOption( 'version', ) )
		return renderVersion();
	
	Git.checkVersion();
	
	const gitDir= args.getOption( 'git-dir', );
	const workTree= args.getOption( 'work-tree', );
	
	console.log( 'Loading git repository.', );
	
	const git= await new Git( gitDir, workTree, );
	
	const host= args.getOption( 'host', '0.0.0.0:8192', );
	
	const app= new App( {
		router,
		webRoot: import.meta.url.replace( /^file:\/\/|\/iGit\.js$/g, '', ).replace( /\/([A-Z]:\/)/, '$1', ),
	}, );
	
	app.git= git;
	
	app.listenHTTP( host, );
	
	console.log( `Listening: http://${host.replace( /0\.0\.0\.0:|^:/, 'localhost:', )}`, );
	console.log( 'Ctrl+C to quit.' );
	
})( Deno.args, ).catch( e=> {
	
	console.error( color.red( 'Error:', ), );
	console.error( color.bgRed( ` ${e.message} `, ), );
	console.error( e.stack, );
	
	Deno.exit( e.code|| 1, );
}, );
