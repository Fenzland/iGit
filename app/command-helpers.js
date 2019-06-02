import { color, } from './modules.deno.js';
import GitCli from '../git/cli/GitCli.js';

const icon= `
              _                 
           ~ / _*_|_            
__________ | \\_/| |_ ___________
`
	.slice( 1, -1, )
	.replace( '~', color.yellow( '~', ), )
	.replace( '*', color.magenta( '*', ), )
;

const help= `
USAGE:
	${ color.yellow( `iGit`, ) } [options]  Start a iGit instance
	${ color.yellow( 'iGit --version', ) }  Show the version of iGit
	${ color.yellow( 'iGit --help', ) }     Show this help

OPTIONS:
	${ color.yellow( '--git-dir', ) }=./.git
		Set the git dir
	
	${ color.yellow( '--work-tree', ) }=.
		Set the git work tree
	
	${ color.yellow( '--host', ) }=0.0.0.0:8192
		Set the host iGit server listens
	
	${ color.yellow( '--client', ) }
	${ color.yellow( '--no-client', ) }
	${ color.yellow( '--client-if-support', ) } default
		Open client or not. The client is depend on Google Chrome.
		If Google Chrome cannot be found, --client will throw a Error, but --client-if-support will run the same as --no-client
`;

export async function renderHelp()
{
	console.log( color.green( icon, ), );
	console.log( help.replace( /\t/g, '    ', ), );
}

export async function renderVersion()
{
	const workTree= fileUrl2Path( import.meta.url, ).replace( /(?<=iGit).*/, '', );
	const gitDir= `${workTree}/.git`;
	
	const cli= await new GitCli( gitDir, workTree, );
	
	const $head= cli.run( 'rev-list', 'HEAD', '--max-count=1', );
	const $tags= cli.getTags();
	
	const head= (await $head).trim();
	const tag= (await $tags).find( tag=> tag.hash === head, );
	
	console.log( '--------- iGit version ---------', )
	
	if( tag )
		console.log( `released: ${color.green( tag.shortName, )}`, );
	else
		console.log( `non-released: ${color.red( head, )}`, );
	
	await cli.fixUntracked();
	
	const changed= (await cli.diff()).length;
	
	if( changed )
		console.log( color.red( `${changed} local ${changed > 1? 'changes': 'change'}`, ), );
}

function fileUrl2Path( url, )
{
	return url
		.replace( 'file://', '', )
		.replace( /\/([A-Z]:\/)/, '$1', )
	;
}
