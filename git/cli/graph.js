import Graph from '../Graph.js';

const formatJson= JSON.stringify( {
	hash:          "%H",
	shortHash:     "%h",
	treeHash:      "%T",
	shortTreeHash: "%t",
	parents:       "%P",
	author:{
		name:          "%an",
		email:         "%ae",
		timestamp:     "%at",
		time:          "%aI",
	},
	committer:{
		name:          "%cn",
		email:         "%ce",
		timestamp:     "%ct",
		time:          "%cI",
	},
	notes:         "%N",
	mark:          "%m",
}, );

/**
 * Get graph
 * 
 * @context {Git}
 * 
 * @return ~[]{}
 */
export async function graph( start, size, )
{
	const delimit= genDelimit();
	
	const output= await this.run( 'log',
		'--parents',
		'--all',
		`--skip=${start}`,
		`--max-count=${size}`,
		'--date-order',
		`--pretty=tformat:${delimit}${formatJson}%n%s%n%b`,
	);
	
	const data= output.split( `${delimit}`, ).slice( 1, ).map( text=> {
		const [ json, title, ...bodyLines ]= text.split( '\n', );
		
		const data= JSON.parse( json, );
		
		data.title= title;
		data.body= bodyLines.join( '\n', ).trim();
		data.parents= data.parents.split( ' ', ).filter( _=> _, );
		
		return data;
	}, );
	
	return data;
}

/**
 * Generate a random delemit.
 * 
 * @return (string)
 */
function genDelimit()
{
	return `<--${
		Math.floor( Math.random()*0x100000000 ).toString( 16, )
	}-->`;
}
