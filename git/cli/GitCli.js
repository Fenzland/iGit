
export default class GitCli
{
	/**
	 * Construct a object to access git cli
	 * 
	 * @param gitDir    (string)
	 * @param ?workTree (string)  optional for bare repository
	 */
	constructor( gitDir, workTree=undefined, )
	{
		this.gitDir= gitDir;
		this.workTree= workTree;
	}
	
	/**
	 * Run a git command in the git-dir and work-tree, and get the result
	 * 
	 * @param command (string)
	 * @param ...args (string)[]
	 * 
	 * @return ~(string)
	 */
	async run( command, ...args )
	{
		const process= this.runProcess( command, ...args, )
		
		return this.constructor.handleProcess( process, );
	}
	
	/**
	 * Run a git command in the git-dir and work-tree, and get the deno process
	 * 
	 * @param command (string)
	 * @param ...args (string)[]
	 * 
	 * @return {Process}
	 */
	runProcess( command, ...args )
	{
		return this.constructor.runProcess(
			`--git-dir=${this.gitDir}`, `--work-tree=${this.workTree}`, command, ...args,
		);
	}
	
	/**
	 * Run git command, and get the result
	 * 
	 * @param ...args (string)[]
	 * 
	 * @return ~(string)
	 */
	static async run( ...args )
	{
		const process= this.runProcess( ...args, )
		
		return this.handleProcess( process, );
	}
	
	/**
	 * Run git command, and get the deno process
	 * 
	 * @param ...args (string)[]
	 * 
	 * @return ~(string)
	 */
	static runProcess( ...args )
	{
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
		const status= process.status();
		const output= process.output();
		
		if( !(await status).success )
			throw new Error( Encoder.decode( await process.stderrOutput(), ), );
		
		return Encoder.decode( await output, );
	}
}
