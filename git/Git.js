import GitCli from './cli/GitCli.js';

export default class Git
{
	/**
	 * Construct a git repository
	 * 
	 * @param gitDir    (string)
	 * @param ?workTree (string)  empty for bare repository
	 * 
	 * @return ~{Git}
	 */
	constructor( gitDir, workTree=undefined, )
	{
		this.cli= new GitCli( gitDir, workTree, );
		
		return (async ()=> {
			
			return this;
		})();
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

