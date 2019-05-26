import { Encoder, } from '../modules.deno.js';

/**
 * Check whether a file is a file (not directory or symbol link).
 * 
 * @param path (string)
 * 
 * @return ~(boolean)
 */
export async function is_file( path, )
{
	return (await Deno.stat( path, )).isFile();
}

export async function file_length( path, )
{
	return (await Deno.stat( path, )).len;
}

export async function read_file( path, { asText=true, }={}, )
{
	const $array= await Deno.readFile( path, );
	
	if( asText )
		return Encoder.decode( $array, );
	else
		return $array;
}
