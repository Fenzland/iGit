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

/**
 * Let git detect untracked files.
 * 
 * @return ~
 */
export async function fixUntracked()
{
	const output= await this.run( 'status', '-s', '--no-renames', );
	const lines= output.split( '\n', );
	
	const newAdded= lines.filter( line=> line.slice( 1, 2, ) === 'A', ).map( line=> line.slice( 3, ), );
	const untracked= lines.filter( line=> line.slice( 1, 2, ) in { A: 1, '?': 1, }, ).map( line=> line.slice( 3, ), );
	
	if( newAdded.length )
		await this.run( 'reset', '--', ...newAdded, );
	
	if( untracked.length )
		await this.run( 'add', '--intent-to-add', '--', ...untracked, );
}
