import GitCli from './cli/GitCli.js';
import CliError from './cli/CliError.js';

export default class Git
{
	/**
	 * Git dir
	 * 
	 * @type (string)
	 */
	#gitDir;
	
	/**
	 * Work tree
	 * 
	 * @type ?(string)
	 */
	#workTree;
	
	/**
	 * Is bare
	 * 
	 * @type (boolean)
	 */
	#isBare;
	
	/**
	 * Construct a git repository
	 * 
	 * @param gitDir   ?(string)
	 * @param workTree ?(string)
	 * 
	 * @return ~{Git}
	 */
	constructor( gitDir=undefined, workTree=undefined, )
	{
		return (async ()=> {
			
			if( gitDir )
				this.#gitDir= gitDir;
			else
				this.#gitDir= (await GitCli.run( 'rev-parse', '--absolute-git-dir', )).trim();
			
			this.#isBare= 'true' === (await GitCli.run( 'rev-parse', '--is-bare-repository', )).trim();
			
			if( workTree )
				this.#workTree= workTree;
			else
			if(!( this.#isBare ))
				this.#workTree= (await GitCli.run( 'rev-parse', '--show-toplevel', )).trim();
			else
				this.#workTree= null;
			
			this.cli= new GitCli( this.#gitDir, this.#workTree, );
			
			
			await this.cli.getHEAD();
			
			return this;
		})().catch( err=> {
			if( err instanceof CliError )
				throw new Error( 'iGit must run in a valid git repository.', );
			else
				throw err;
		}, );
	}
	
	/**
	 * Get the git refs
	 * 
	 * @param start (number)
	 * @param size  (number)
	 * 
	 * @return ~[]{}
	 */
	async getRefs()
	{
		return this.cli.getAllRefs();
	}
	
	/**
	 * Get the log graph
	 * 
	 * @param start (number)
	 * @param size  (number)
	 * 
	 * @return ~[]{}
	 */
	async getGraph( start, size, )
	{
		return this.cli.graph( start, size, );
	}
	
	/**
	 * Get the git index status
	 * 
	 * @return ~[]{ file:(string), toFile:?(string), staged:(string), unstaged:(string), }
	 */
	async getIndex()
	{
		if( this.#isBare && !this.#workTree )
			return [];
		
		await this.cli.fixUntracked();
		
		return this.cli.getIndex();
	}
	
	/**
	 * Get details of index.
	 * 
	 * @return ~{ unstaged:{Diff}, staged:{Diff}, turnBack, }
	 */
	async diffIndex( ...files )
	{
		if( this.#isBare && !this.#workTree )
			throw new Error( 'There is no index', );
		
		const $unstaged= this.cli.diff( 'INDEX', 'WORK_TREE', ...files, );
		const $staged= this.cli.diff( 'HEAD', 'INDEX', ...files, );
		const $turnBack= this.cli.diff( 'WORK_TREE', 'HEAD', ...files, );
		
		return {
			unstaged: await $unstaged,
			staged:   await $staged,
			turnBack: await $turnBack,
		};
	}
	
	/**
	 * Check git version.
	 * 
	 * @return ~
	 * 
	 * @throw {Error}
	 */
	static async checkVersion()
	{
		const v= (await GitCli.run( '--version', )).replace( 'git version ', '', ).split( '.', ).map( x=> +x, );
		
		if(!( v[0] >= 2 && v[1] >= 18 ))
			throw new Error( 'iGit need git version >= 2.18', );
	}
}

