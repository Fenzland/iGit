import GitCli from './cli/GitCli.js';

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
		})().catch( ()=> {
			throw new Error( 'iGit must run in a valid git repository.', );
		}, );
	}
}

