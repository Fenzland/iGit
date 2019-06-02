import Refs from '../git/Refs.js';
import Graph from '../git/Graph.js';
import Diff from '../git/Diff.js';
import TripleDiff from '../git/TripleDiff.js';

export async function getRefs( { forceUpdate=false, }={}, )
{
	const fetchRefs= ()=> fetch( '/refs', ).then( _=> _.json(), ).then( _=> new Refs( _, ), );
	
	if( forceUpdate )
		return cache.set( '$refs', fetchRefs(), );
	
	return cache.getOrSet( '$refs', fetchRefs, );
}

export async function getGraph( { size=0x40, forceUpdate=false, }={}, )
{
	const url= new URL( location, );
	url.pathname= '/graph';
	
	url.searchParams.set( 'start', 0, );
	url.searchParams.set( 'size', size, );
	
	const $data= fetch( url, ).then( _=> _.json(), );
	const refs= await getRefs();
	const graph= new Graph( await $data, );
	
	for( let ref of refs )
	{
		const commit= graph.getCommit( ref.hash, );
		
		if(!( commit ))
			continue;
		
		const links= commit.refs || (commit.refs= new Set());
		
		links.add( ref, );
	}
	
	return graph;
}

export async function appendGraph( graph, { start=0, size=0x40, forceUpdate=false, }={}, )
{
	const url= new URL( location, );
	url.pathname= '/graph';
	
	url.searchParams.set( 'start', start, );
	url.searchParams.set( 'size', size, );
	
	const $data= fetch( url, ).then( _=> _.json(), );
	const refs= await getRefs();
	
	graph.concat( await $data, );
	
	for( let ref of refs )
	{
		const commit= graph.getCommit( ref.hash, );
		
		if(!( commit ))
			continue;
		
		const links= commit.refs || (commit.refs= new Set());
		
		links.add( ref, );
	}
	
	return graph;
}

export async function getChangedFiles( { forceUpdate=false, }={}, )
{
	if( !forceUpdate && cache.has( 'changed-files', ) )
		return cache.get( 'changed-files', );
	
	return fetch( '/changed-files', ).then( _=> _.json(), ).then( _=> cache.set( 'changed-files', _, ), );
}

export async function diffFileOnIndex( file, toFile, )
{
	const url= new URL( location, );
	url.pathname= '/diff-index';
	
	url.searchParams.append( 'files[]', file, );
	
	if( toFile )
		url.searchParams.append( 'files[]', toFile, );
	
	const { unstaged: [ leftText, ], staged: [ rightText, ], turnBack: [ turnBackText, ], }= await fetch( url, ).then( _=> _.json(), );
	const left= new Diff( leftText, );
	const right= new Diff( rightText, );
	const turnBack= new Diff( turnBackText, );
	
	return new TripleDiff( left, right, turnBack, );
}

const cache= {
	store: {},
	
	set( key, value, ){
		return this.store[key]= value;
	},
	
	has( key, ){
		return this.store.hasOwnProperty( key, );
	},
	
	get( key, deflt=undefined, ){
		if( this.has( key, ) )
			return this.store[key];
		
		return deflt instanceof Function? deflt(): deflt;
	},
	
	getOrSet( key, deflt=undefined, ){
		if( this.has( key, ) )
			return this.store[key];
		
		const value= deflt instanceof Function? deflt(): deflt;
		
		this.set( key, value, );
		
		return value;
	}
};
