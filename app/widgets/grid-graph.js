import { ele, txt, newReact, newRef, newArray, _for, _if, } from '/web/butterfly/src/butterfly.js';
import makeScrollList from './scrolling-list.js';
import { getGraph, appendGraph, } from '../git-data.js';

const focusLine= newReact( 0, );
const scrollAtLine= newReact( 0, );
const pageSize= newReact( 1, );
const detailShown= newReact( true, );

const graph= newArray();
const threads= newArray();

const currentLine= newRef( [ graph, focusLine, ], ( graph, focusLine, )=> graph[focusLine], );
const currentCommit= newRef( [ currentLine, ], currentLine=> currentLine&& currentLine.commit, );
const scrollCenterLine= newRef( [ scrollAtLine, graph, ], ()=> 0, );

export async function main()
{
	// return;
	const gitData= await import ('/app/git-data.js');
	
	const graphInstance= await gitData.getGraph();
	
	graph.setValue( graphInstance.graph, );
	threads.setValue( graphInstance.threads, );
}

export const states= {
	graph,
	threads,
};

// (async ()=> {
// 	await timeout( 100, );
	
// 	const graphInstance= await getGraph();
	
// 	graph.setValue( graphInstance.graph, );
// 	threads.setValue( graphInstance.threads, );
// })();


export default [
	makeScrollList( {
		focusLine: scrollCenterLine,
		classes: [ 'grid-item', 'graph', ],
	}, [
		_for( graph, ( line, index, )=> [
			ele( 'li', {}, {}, [
				ele( 'span', { class:'graph-node-wrapper', }, {}, [
					_for( line.children, child=> [
						ele( 'span', { class:[ 'tie', ], }, {}, [], ),
					], ),
					ele( 'a', { class:'graph-node', title:line.commit.hash, }, { listeners:{ click:event=> mouseFocusTo( event, index, ), }, }, [], ),
				], ),
				ele( 'a', { class:'graph-node', title:line.commit.hash, }, { listeners:{ click:event=> mouseFocusTo( event, index, ), }, }, [
					txt( line.commit.shortHash, ),
				], ),
				ele( 'span', {}, {}, [
					txt( line.commit.shortHash, ),
				], ),
				_if( line.commit.refs, ()=> [
					ele( 'span', { class:'ref-list', }, {}, [
						_for( line.commit.refs, ref=> [
							ele( 'span', { class:[ 'ref', newRef( [ ref.type, ], type=> `type-${type}`, ), ], title:ref.name, }, {}, [
								txt( ref.shortName, ),
							], ),
						], ),
					], ),
				] ),
			], ),
		], ),
		_if( newRef( [ threads, ], threads=> threads.length, ), ()=> [
			ele( 'li', { class:[ 'line', 'threads', ], }, {}, [
				_for( threads, ( thread, index, )=> [
					ele( 'span', { class:'graph-node-wrapper', }, {}, [
						_if( thread, ()=> [
							ele( 'span', { class:[ 'tie', ], }, {}, [], ),
						], ),
					], ),
				], ),
			], ),
		], ),
	], ),
	_if( newRef( [ graph, currentCommit, ], ( graph, currentCommit, )=> graph && currentCommit, ), ()=> [
		ele( 'div', { class:[ 'detail', { show:detailShown, }, ], }, {}, [
			ele( 'p', { class:'hash', }, {}, [
				ele( 'span', { class:'short-hash', }, {}, [ txt( newRef( [ currentCommit, ], currentCommit=> currentCommit&& currentCommit.shortHash, ), ), ], ),
				txt( newRef( [ currentCommit, ], currentCommit=> currentCommit&& currentCommit.hash.slice( currentCommit.shortHash.length, ), ), ),
			], ),
			_if( newRef( [ currentCommit, ], currentCommit=> currentCommit&& currentCommit.refs, ), ()=> [
				ele( 'p', { class:'ref-list', }, {}, [
					_for( newRef( [ currentCommit, ], currentCommit=> currentCommit&& currentCommit.refs, ), ref=> [
						ele( 'span', { class:'ref', }, {}, [
							txt( newRef( [ ref.name, ], name=> `${name}`.slice( 0, -ref.shortName.length, ), ), ),
							ele( 'span', { class:newRef( [ ref.type, ], type=> `type-${type}`, ), title:ref.name, }, {}, [ txt( ref.shortName, ), ], ),
						], ),
					], )
				], ),
			], ),
			ele( 'p', {}, {}, [ txt( newRef( [ currentCommit, ], currentCommit=> currentCommit&& currentCommit.title, ), ), ], ),
			ele( 'pre', {}, {}, [ txt( newRef( [ currentCommit, ], currentCommit=> currentCommit&& currentCommit.body, ), ), ], ),
			ele( 'div', { class:'author', }, {}, [
				ele( 'p', {}, {}, [
					txt( newRef( [ currentCommit, ], currentCommit=> currentCommit&& currentCommit.author.name, ), ),
					txt( '<', ),
					ele( 'a', { href:newRef( [ currentCommit, ], currentCommit=> currentCommit&& `mailto:${currentCommit.author.email}`, ), }, {}, [
						txt( newRef( [ currentCommit, ], currentCommit=> currentCommit&& currentCommit.author.email, ), ),
					], ),
					txt( '>', ),
				], ),
				ele( 'p', {}, {}, [ txt( newRef( [ currentCommit, ], currentCommit=> currentCommit&& currentCommit.author.time, ), ), ], ),
			], ),
		], ),
	], ),
];
