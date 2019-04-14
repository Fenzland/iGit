import '../init.js';
import { Vue, } from './modules.web.js';
import Eve from './Eve.js';
import store from './store.js';
import gridRefs    from './components/grid-refs.js';
import gridGraph   from './components/grid-graph.js';
import gridFileDiff    from './components/grid-file-diff.js';
import gridContentDiff from './components/grid-content-diff.js';

Vue.prototype.z= z;
Vue.use( Eve, );

const app= new Vue( {
	el: 'body>main',
	store,
	
	components: {
		gridRefs,
		gridGraph,
		gridFileDiff,
		gridContentDiff,
	},
	
	template: /*HTML*/`
		<main :class="[ $store.state.mode, ]">
			<header>
				<h1> iGit </h1>
			</header>
			<grid-refs         ref="refs"         :focused="focusGrid==='refs'"         v-on:blur="blur( 'refs', )"         ></grid-refs>
			<grid-graph        ref="graph"        :focused="focusGrid==='graph'"        v-on:blur="blur( 'graph', )"        ></grid-graph>
			<grid-file-diff    ref="file_diff"    :focused="focusGrid==='file_diff'"    v-on:blur="blur( 'file_diff', )"    ></grid-file-diff>
			<grid-content-diff ref="content_diff" :focused="focusGrid==='content_diff'" v-on:blur="blur( 'content_diff', )" ></grid-content-diff>
		</main>
	`,
	
	data: {
		focusGrid: null,
	},
	
	methods: {
		keydown( key, ){
			
			z(key);
			if( this.focusGrid )
				return this.$refs[this.focusGrid].keydown( key, );
			
			switch( key.key )
			{
				case 'v':
					this.focusGrid='refs';
				break;
				
				case 'g':
					this.focusGrid='graph';
				break;
			}
		},
		
		blur( grid, )
		{
			if( this.focusGrid===grid )
				this.focusGrid= null;
		},
		
		resize(){
			Object.values( this.$refs, ).forEach( ref=> {
				if( ref.resize && ref.resize instanceof Function )
					ref.resize();
			}, );
		},
	},
}, );

document.addEventListener( 'keydown', event=> {
	const modifiers= [];
	
	if( event.metaKey )
		modifiers.push( 'Meta', );
	
	if( event.ctrlKey )
		modifiers.push( 'Ctrl', );
	
	if( event.altKey )
		modifiers.push( 'Alt', );
	
	if( event.shiftKey )
		modifiers.push( 'Shift', );
	
	app.keydown( {
		key: event.key,
		modifiers,
	}, );
	
	// event.preventDefault();
}, );

window.addEventListener( 'resize', event=> {
	app.resize();
}, )
