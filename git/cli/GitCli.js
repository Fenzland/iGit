import { getIndex, fixUntracked, } from './git-index.js';
import { getHEAD, getAllRefs, } from './refs.js';
import { graph, } from './graph.js';
import { diff, } from './diff.js';
import { Encoder, } from '../../app/modules.js';
import CliError from './CliError.js';

let blocker= Promise.resolve();

export default class GitCli
{
	/**
	 * Args for git main command
	 * 
	 * @type [](string)
	 */
	#gitArgs= [];
	
	/**
	 * Construct a object to access git cli
	 * 
	 * @param gitDir    (string)
	 * @param workTree  (string)  for non-bare repository
	 *                  (null)    for bare repository
	 */
	constructor( gitDir, workTree, )
	{
		this.#gitArgs.push( `--git-dir=${gitDir}`, );
		
		if( workTree )
			this.#gitArgs.push( `--work-tree=${workTree}`, );
	}
	
	/**
	 * Run a git command in the git-dir and work-tree, and get the result
	 * 
	 * @param command (string)
	 * @param ...args []<(string)|{:}>
	 * 
	 * @return ~(string)
	 */
	async run( command, ...args )
	{
		const process= await this.runProcess( command, ...args, )
		
		return this.constructor.handleProcess( process, )
			.catch( retryWhenLocked( ()=> this.run( command, ...args, ), ), )
		;
	}
	
	/**
	 * Run a git command in the git-dir and work-tree, and get the deno process
	 * 
	 * @param command (string)
	 * @param ...args []<(string)|{:}>
	 * 
	 * @return ~{Process}
	 */
	async runProcess( command, ...args )
	{
		return await this.constructor.runProcess(
			this.#gitArgs, command, ...args,
		);
	}
	
	/**
	 * Run git command, and get the result
	 * 
	 * @param ...args []<(string)|{:}>
	 * 
	 * @return ~(string)
	 */
	static async run( ...args )
	{
		const process= await this.runProcess( ...args, )
		
		return this.handleProcess( process, )
			.catch( retryWhenLocked( ()=> this.run( ...args, ), ), )
		;
	}
	
	/**
	 * Run git command, and get the deno process
	 * 
	 * @param ...args []<(string)|{:}>
	 * 
	 * @return ~{Process}
	 */
	static async runProcess( ...args )
	{
		await blocker;
		
		const options= extractOptions( args, );
		
		return Deno.run( {
			args: [
				'git',
				'--no-pager',
				...args,
			],
			stdin: 'piped',
			stdout: 'piped',
			stderr: 'piped',
		}, );
	}
	
	/**
	 * Handle a deno process and get the result
	 * 
	 * @param process {Process}
	 * 
	 * @return ~(string)
	 */
	static async handleProcess( process, )
	{
		const $status= process.status();
		const $output= process.output();
		
		try
		{
			const status= await $status;
			
			if( !status.success )
				throw new CliError( status.code, await process.stderrOutput(), );
			
			return Encoder.decode( await $output, );
		}
		finally
		{
			try{ process.stdin.close(); }catch( e ){}
			try{ process.stdout.close(); }catch( e ){}
			try{ process.stderr.close(); }catch( e ){}
			process.close();
		}
	}
}

/**
 * Extract the options out from arguments
 * @param  args []<(string)|{:}>
 * 
 * @return {:}
 */
function extractOptions( args )
{
	const options= {};
	
	for( let i= 0; i <= args.length; )
	{
		if( typeof args[i] === 'object' && args[i] )
			Object.assign( options, ...args.splice( i, 1, ), );
		else
			++i;
	}
	
	return options;
}

function retryWhenLocked( callback, )
{
	return blocker= async e=> {
		if( e.locked )
		{
			await timeout( 500, );
			
			await Deno.remove( e.message.find( /'([^']+\/index.lock)'/, 1, ), ).catch( ()=> {}, );
			
			return callback();
		}
		else
			throw e;
	};
}

Object.assign( GitCli.prototype, {
	getIndex,
	fixUntracked,
	graph,
	diff,
	getHEAD,
	getAllRefs,
}, );
