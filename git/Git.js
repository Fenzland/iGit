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
}

