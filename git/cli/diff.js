import Diff from '../Diff.js';

const commonOptions= [ '--ita-invisible-in-index', ];

/**
 * Diff all tree
 * 
 * @param from (string)
 * @param to   (string)
 * 
 * @return ~{Diff}[]
 */
export async function diff( from='INDEX', to='WORK_TREE', ...files )
{
	const diffDoc= await this.run(
		'diff',
		...commonOptions,
		...genRefs( from, to, ),
		...(files.length? [ '--', ...files, ]: []),
	);
	
	return parseDiffResult( diffDoc, );
}

/**
 * Fit the syntax of git diff
 * 
 * @param from (string)
 * @param to   (string)
 * 
 * @return (string)[]
 */
function genRefs( from='INDEX', to='WORK_TREE', )
{
	if( to === 'WORK_TREE' )
	{
		if( from === 'INDEX' )
			return [];
		else
			return [ from, ];
	}
	else
	if( from === 'WORK_TREE' )
	{
		if( to === 'INDEX' )
			return [ '-R', ];
		else
			return [ '-R', to, ];
	}
	else
	if( to === 'INDEX' )
		return [ '--cached', from, ];
}

/**
 * Parse diff result and make Diff objects
 * 
 * @param diffResult (string)
 * 
 * @return []{Diff}
 */
function parseDiffResult( diffResult, )
{
	const diffDocs= `\n${diffResult}`.split( '\ndiff --', ).slice( 1, ).map( x=> `diff --${x}`, );
	
	return diffDocs.map( diffDoc=> new Diff( diffDoc, ), );
}
