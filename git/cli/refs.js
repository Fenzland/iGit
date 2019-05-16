
/**
 * Get HEAD ref
 * 
 * @return ~{}
 */
export async function getHEAD()
{
	const $output= this.run( 'show', '--no-patch', `--pretty=format:{"hash":"%H","shortHash":"%h"}`, 'HEAD', )
	
	const $symref= this.run( 'symbolic-ref', 'HEAD', );
	
	const data= JSON.parse( await $output, );
	
	data.name= 
	data.shortName= 
	data.type= 
		'HEAD'
	;
	data.symref= await $symref.then( _=> _.trim(), ).catch( ()=> null, );
	
	return data;
}

const refFormat= `--format=${
	JSON.stringify( {
		name: '%(refname)',
		shortName: '%(refname:short)',
		hash: '%(objectname)',
		shortHash: '%(objectname:short)',
		symref: '%(symref)',
	}, )
}`;

/**
 * Get all refs
 * 
 * @return ~{}
 */
export async function getAllRefs()
{
	const $HEAD= this.getHEAD();
	const $output= this.run( 'for-each-ref', refFormat, );
	
	const refs= parseRefs( await $output, );
	
	return [ await $HEAD, ...refs, ];
}

/**
 * Parse output string of git-for-each-ref
 * 
 * @param output (string)
 * 
 * @return []{}
 */
function parseRefs( output, )
{
	return output.trim().split( '\n', ).map( json=> {
		const ref= JSON.parse( json, );
		
		if( !ref.symref )
			ref.symref= null;
		
		ref.type= ref.name.slice( 5, -2 - ref.shortName.length, );
		
		return ref;
	}, )
}
