
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
