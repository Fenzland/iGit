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
		<main :style="{ '--second-row-size':(secondRowOpened? secondRowSize: 0), '--second-row-size-offset':(secondRowOpened? secondRowSizeOffset: 0), }">
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
		focusedGridName: null,
		secondRowOpened: false,
		secondRowSize: 8,
		secondRowSizeOffset: 0,
	},
	
	computed: {
		focusedGrid(){
			return this.$refs[this.focusedGridName];
		},
	},
	
	methods: {
		async openSecondRow(){
			if(!( this.secondRowOpened ))
			{
				this.secondRowOpened= true;
				
				await timeout();
				
				this.resize();
			}
		},
		
		async closeSecondRow(){
			if( this.secondRowOpened )
			{
				this.secondRowOpened= false;
				
				await timeout();
				
				this.resize();
			}
		},
		
		focusToGrid( grid, ){
			this.focusedGridName= grid;
		},
		
		keydown( key, ){
			
			// z( key, 'keydown', );
			
			if( this.focusedGridName )
				return this.focusedGrid.keydown( key, );
			
			switch( key.key )
			{
				case 'h':
					return this.focusToGrid( 'refs', ), true;
				break;
				
				case 't':
					return this.focusToGrid( 'graph', ), true;
				break;
				
				case 'n':
					return this.focusToGrid( 'changed_files', ), true;
				break;
				
				case 's':
					return this.focusToGrid( 'content_diff', ), true;
				break;
			}
		},
		
		keyup( key, ){
			
			// z( key, 'keyup' );
			
			if( this.focusedGridName )
				return this.$refs[this.focusedGridName].keyup( key, );
			
			switch( key.key )
			{
			}
		},
		
		blurGrid( grid, )
		{
			if( this.focusedGridName===grid )
				this.focusedGridName= null;
		},
		
		onWindowBlur()
		{
			if( this.focusedGridName && this.focusedGrid.onWindowBlur )
				this.focusedGrid.onWindowBlur();
		},
		
		resize(){
			Object.values( this.$refs, ).forEach( ref=> {
				if( ref.resize && ref.resize instanceof Function )
					ref.resize();
			}, );
		},
	},
	mounted(){
		this.$eve.listen( 'focus-to-file', this.openSecondRow, )
		this.$eve.listen( 'blur-file', this.closeSecondRow, )
		this.$eve.listen( 'grid-focus', this.focusToGrid, )
	},
}, );

window.addEventListener( 'keydown', handleKey, );
window.addEventListener( 'keyup', handleKey, );

function handleKey( event, )
{
	const modifiers= [];
	
	if( event.metaKey )
		modifiers.push( 'Meta', );
	
	if( event.ctrlKey )
		modifiers.push( 'Ctrl', );
	
	if( event.altKey )
		modifiers.push( 'Alt', );
	
	if( event.shiftKey )
		modifiers.push( 'Shift', );
	
	const effective= app[event.type]( {
		key: event.key,
		modifiers,
	}, );
	
	if( effective )
		event.preventDefault();
}

window.addEventListener( 'blur', event=> {
	app.onWindowBlur();
}, );
window.addEventListener( 'resize', event=> {
	app.resize();
}, );
