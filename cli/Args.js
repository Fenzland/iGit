
export default class Args
{
	/**
	 * @param ...args (string)
	 */
	constructor( ...args )
	{
		this.args= args;
		this.params= [];
		this.options= {};
		
		for( const arg of args )
		{
			if( arg.startsWith( '--' ) )
			{
				const [ option, ...rest ]= arg.slice( 2, ).split( '=', );
				
				this.options[option]= rest.length? rest.join( '=', ): true;
			}
			else
			if( arg.startsWith( '-', ) )
			{
				const options= arg.slice( 1, ).split( '', );
				
				for( const option of options )
					this.options[option]= true;
			}
			else
				this.params.push( arg, );
		}
	}
	
	/**
	 * check whether the argument bag has the given option.
	 * 
	 * @param ...options [](string)  option name, must without '-' or '--'
	 */
	hasOption( ...options )
	{
		return options.some( option=> this.options.hasOwnProperty( option, ), );
	}
	
	/**
	 * check whether the argument bag has the given option.
	 * 
	 * @param option (string)     option name, must without '-' or '--'
	 * @param deflt  (string)     default value
	 *               =>(string)   default value
	 */
	getOption( option, deflt=undefined, )
	{
		return (
			this.hasOption( option, )? this.options[option]: 
			deflt instanceof Function? deflt(): deflt
		);
	}
	
}