import '../init.js';
import { Vue, } from './modules.web.js';
import Eve from './Eve.js';
import gridRefs from './components/grid-refs.js';
import gridGraph from './components/grid-graph.js';
import gridChangedFiles from './components/grid-changed-files.js';
import gridContentDiff from './components/grid-content-diff.js';

Vue.prototype.z= z;
Vue.use( Eve, );

Vue.prototype.formatTime= time=> new Date( time, ).toLocaleString(
	navigator.language,
	{ year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long', hour: '2-digit', hour12: false, minute: '2-digit', },
)

const app= new Vue( {
	el: 'body>main',
	
	components: {
		gridRefs,
		gridGraph,
		gridChangedFiles,
		gridContentDiff,
	},
	
	template: /*HTML*/`
		<main>
			<header>
				<h1> <img class="logo" src="/logo.svg">iGit </h1>
				<span class="version"> v0.2.0 </span>
			</header>
			<grid-refs          ref="refs"          :focused="focusedGridName==='refs'"          v-on:blur="blurGrid( 'refs', )"          v-on:click.native.capture="focusedGridName= 'refs'"          ></grid-refs>
			<grid-graph         ref="graph"         :focused="focusedGridName==='graph'"         v-on:blur="blurGrid( 'graph', )"         v-on:click.native.capture="focusedGridName= 'graph'"         ></grid-graph>
			<grid-changed-files ref="changed_files" :focused="focusedGridName==='changed_files'" v-on:blur="blurGrid( 'changed_files', )" v-on:click.native.capture="focusedGridName= 'changed_files'" ></grid-changed-files>
			<grid-content-diff  ref="content_diff"  :focused="focusedGridName==='content_diff'"  v-on:blur="blurGrid( 'content_diff', )"  v-on:click.native.capture="focusedGridName= 'content_diff'"  ></grid-content-diff>
		</main>
	`,
	
	data: {
	},
}, );
