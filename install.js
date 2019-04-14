import './init.js';
import { file_exists, } from './dragonfly/modules.deno.js';
import Args from './cli/Args.js';

const env= Deno.env();
const args= new Args( ...Deno.args, );

const denoDir= env.DENO_DIR || `${env.HOME}/.deno`;
const gitDir= `${denoDir}/iGit`;
const version= args.getOption( 'version', 'origin/release', );
const repository= (()=> {
	if( args.hasOption( 'repository', ) )
		return args.getOption( 'repository', );
	
	const protocol= args.getOption( 'protocol', 'https', );
	
	switch( protocol )
	{
		default:
			console.error( `--protocol=${protocol} is invalid, https used.`, );
		case 'https':
			return 'https://github.com/Fenzland/iGit';
		break;
		
		case 'ssh':
			return 'git@github.com:Fenzland/iGit.git';
		break;
	}
})();

(async ()=> {
	
	if( await file_exists( gitDir, ) )
		update();
	else
		install();
})();

async function update()
{
	await runGit( 'fetch', '--all', );
	
	await runGit( 'checkout', '-B', 'release', 'origin/release', );
	
	Deno.copyFile( `${denoDir}/iGit/bin/iGit`, `${denoDir}/bin/iGit`, );
}

async function install()
{
	await run( 'git', 'clone', repository, gitDir, );
	
	await runGit( 'checkout', '-B', 'release', 'origin/release', );
	
	Deno.copyFile( `${denoDir}/iGit/bin/iGit`, `${denoDir}/bin/iGit`, );
}

async function run( ...args )
{
	return Deno.run( {
		args,
		stdout: 'null',
		stderr: 'null',
	}, ).status();
}

async function runGit( command, ...args )
{
	return run(
		'git',
		`--git-dir=${gitDir}/.git`, `--work-tree=${gitDir}`,
		command,
		...args,
	);
}
