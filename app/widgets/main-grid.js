import { ele, txt, wid, } from '/web/butterfly/src/butterfly.js';
import * as grid_refs from './grid-refs.js';
import * as grid_graph from './grid-graph.js';

export default [
	ele( 'main', { class:'root', }, {}, [
		ele( 'header', {}, {}, [
			ele( 'h1', {}, {}, [
				ele( 'img', { class:'logo', src:'/logo.svg', }, {}, ),
				txt( 'iGit', ),
			], ),
			ele( 'span', { class:'version', }, {}, [ txt( ' v0.2.0', ), ], ),
		], ),
		wid( grid_refs, ),
		wid( grid_graph, ),
	], ),
];
