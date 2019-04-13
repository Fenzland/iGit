
const EXT2MIME= {};

const MIME2EXT= {};

/**
 * Extension name to MIME type
 * 
 * @param ext (string)  extension name
 * 
 * @return (string)     MIME type
 */
export function ext2mime( ext, )
{
	if( ext.startsWith( '.', ) )
		ext= ext.slice( 1, );
	
	return EXT2MIME[ext] || 'application/octet-stream';
}

/**
 * MIME type to Extension name
 * 
 * @param mime (string)   MIME type
 * 
 * @return ext (string)   extension name
 */
export function mime2ext( mime, )
{
	return MIME2EXT[mime] || null;
}
