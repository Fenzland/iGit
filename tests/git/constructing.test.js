import Git from '../../git/Git.js';
import Graph from '../../git/Graph.js';
import { BASE_DIR, } from '../env.js';

(async()=> {
	const $git= new Git( `${BASE_DIR}/.git`, BASE_DIR, );
	console.assert( $git instanceof Promise, 'new Git() must returns a promise.', );
	
	const git= await $git;
	console.assert( git instanceof Git, 'await new Git() must returns a instance of Git', );
	console.assert( git.graph instanceof Graph, '{Git}.graph must be a instance of Graph', );
})();
