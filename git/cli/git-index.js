import { Encoder, } from '../../app/modules.js';

const fileStautses= {
	' ': '',
	M: 'modified',
	A: 'added',
	D: 'deleted',
	R: 'renamed',
	C: 'copied',
	U: 'unmerged',
};

/**
 * Get the git index status
 * 
 * @return ~[]{ file:(string), toFile:?(string), staged:(string), unstaged:(string), }
 */
export async function getIndex()
{
	const output= await this.run( 'status', '-s', '-uall', );
	
	if( !output )
		return [];
	
	return output.replace( /\n$/, '', ).split( '\n', ).map( line=> {
		const [ file, toFile=undefined, ]= line.slice( 3, ).split( ' -> ', );
		
		const staged= fileStautses[line.slice( 0, 1, )];
		const unstaged= fileStautses[line.slice( 1, 2, )];
		
		return {
			file,
			toFile,
			staged,
			unstaged,
		};
	}, );
}
