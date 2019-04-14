
const template= /*HTML*/`
<section :class="{ 'grid-item':true, graph:true, 'scroll-container':true, focus:focused, }">
	<ul class="scroll-body" :style="{ '--scroll-top': focusLine, }">
		<template v-for="(line,index) of graph">
			<li :class="{ line:true, focus: index===focusLine, }">
				<div class="graph-line">
					<template v-for="item of line.graph">
						<div :class="[ 'graph-item', item, ]"></div>
					</template>
				</div>
				<template v-if="line.commit">
					<a
						href="javascript:;"
						class="commit"
						v-on:click="focusTo(index)"
						v-on:focus="focusTo(index)"
					>
						{{ line.commit }}
					</a>
				</template>
			</li>
		</template>
	</ul>
</section>
`;


export default {
	template,
	
	props: {
		focused: {
			type: Boolean,
			default: false,
		},
	},
	
	data: ()=> ({
		focusLine: 0,
		pageSize: 1,
		graph: getGraphData(),
	}),
	
	mounted(){
		this.toHome();
		this.resize();
		this.$eve.listen( 'update-commit', this.focusToCommit, );
	},
	
	destroyed()
	{
		this.$eve.unlisten( 'update-commit', this.focusToCommit, );
	},
	
	computed: {
		currentCommit(){
			const graphLine= this.graph[this.focusLine];
			
			if( graphLine && graphLine.commit )
				return graphLine.commit;
			else
				return null;
		},
	},
	
	methods: {
		focusTo( line, ){
			this.focusLine= line;
			
			this.$eve.dispatch( 'update-commit', this.currentCommit, );
		},
		
		focusToCommit( commit, ){
			if( this.currentCommit === commit )
				return;
			
			const line= this.graph.find( graphLine=> graphLine.commit === commit, );
			
			if( line >= 0 )
				this.focusLine= line;
		},
		
		toHome(){
			for(
				let i= 0;
				i < this.graph.length;
				++i
			)if( this.graph[i].commit )
				return this.focusTo( i, );
		},
		toEnd(){
			for(
				let i= this.graph.length - 1;
				i >= 0;
				--i
			)if( this.graph[i].commit )
				return this.focusTo( i, );
		},
		toNext( line=1, ){
			for(
				let i= Math.min( this.graph.length - 1, this.focusLine - - line, );
				i < this.graph.length;
				++i
			)if( this.graph[i].commit )
				return this.focusTo( i, );
		},
		toPrev( line=1, ){
			for(
				let i= Math.max( 0, this.focusLine - line, );
				i >= 0;
				--i
			)if( this.graph[i].commit )
				return this.focusTo( i, );
		},
		toNextPage( page=0.5, ){
			for(
				let i= Math.min( this.graph.length - 1, this.focusLine - - Math.round( page*this.pageSize, ), );
				i < this.graph.length;
				++i
			)if( this.graph[i].commit )
				return this.focusTo( i, );
		},
		toPrevPage( page=0.5, ){
			for(
				let i= Math.max( 0, this.focusLine - Math.round( page*this.pageSize, ), );
				i >= 0;
				--i
			)if( this.graph[i].commit )
			{
				this.focusLine= i;
				
				return;
			}
		},
		
		keydown( key, ){
			
			switch( key.key )
			{
				case 'Escape': this.$emit( 'blur', ); break;
				
				case 'ArrowUp': this.toPrev(); break;
				case 'ArrowDown': this.toNext(); break;
				
				case 'PageUp': this.toPrevPage(); break;
				case 'PageDown': this.toNextPage(); break;
				
				case 'Home': this.toHome(); break;
				case 'End': this.toEnd(); break;
			}
		},
		
		resize()
		{
			const dom= this.$el;
			const rect= dom.getBoundingClientRect();
			const lineRect= dom.firstElementChild.firstElementChild.getBoundingClientRect();
			this.pageSize= Math.round( rect.height/lineRect.height, );
		},
	},
};

function getGraphData()
{
	return [
		{ graph: [ 'commit', ], commit: '503d669', },
		{ graph: [ 'vertical', 'back', ], },
		{ graph: [ 'vertical', 'empty', 'commit', ], commit: 'e1801da', },
		{ graph: [ 'vertical', 'empty', 'commit', ], commit: '66e0f87', },
		{ graph: [ 'vertical', 'out', ], },
		{ graph: [ 'commit', ], commit: 'f9ef2bf', },
		{ graph: [ 'vertical', 'back', ], },
		{ graph: [ 'commit', 'empty', 'vertical', ], commit: '000a9d0', },
		{ graph: [ 'vertical', 'back', 'empty', 'back', ], },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: '44f979b', },
		{ graph: [ 'vertical', 'out', 'empty', 'out', ], },
		{ graph: [ 'commit', 'empty', 'vertical', ], commit: '413a40d', },
		{ graph: [ 'vertical', 'back', 'empty', 'back', ], },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: 'abc331a', },
		{ graph: [ 'vertical', 'out', 'empty', 'out', ], },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'commit', ], commit: 'e4c80e9', },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'commit', ], commit: '4865cec', },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'commit', ], commit: '3dcf248', },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'commit', ], commit: '1f1c25e', },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'commit', ], commit: '817bc11', },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'commit', ], commit: '8491dd5', },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'commit', ], commit: '6ae927e', },
		{ graph: [ 'vertical', 'empty', 'vertical', 'out', ], },
		{ graph: [ 'vertical', 'out', 'vertical', ], },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'commit', ], commit: '03b5b7a', },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'vertical', 'back', ], },
		{ graph: [ 'vertical', 'empty', 'vertical', 'horizon', 'vertical', 'out', ], },
		{ graph: [ 'vertical', 'out', 'vertical', 'empty', 'vertical', ], },
		{ graph: [ 'commit', 'empty', 'vertical', 'empty', 'vertical', ], commit: '3f5c8e3', },
		{ graph: [ 'vertical', 'back', 'empty', 'back', 'empty', 'back', ], },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', 'empty', 'vertical', ], commit: '5ab996e', },
		{ graph: [ 'vertical', 'out', 'empty', 'out', 'empty', 'out', ], },
		{ graph: [ 'commit', 'empty', 'vertical', 'empty', 'vertical', ], commit: '205a570', },
		{ graph: [ 'vertical', 'back', 'empty', 'back', 'empty', 'back', ], },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', 'empty', 'vertical', ], commit: '175fc3b', },
		{ graph: [ 'vertical', 'out', 'empty', 'out', 'empty', 'out', ], },
		{ graph: [ 'commit', 'empty', 'vertical', 'empty', 'vertical', ], commit: 'a6dd649', },
		{ graph: [ 'vertical', 'back', 'empty', 'back', 'empty', 'back', ], },
		{ graph: [ 'vertical', 'empty', 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: '7019318', },
		{ graph: [ 'vertical', 'empty', 'vertical', 'out', 'empty', 'out', ], },
		{ graph: [ 'vertical', 'out', 'vertical', 'empty', 'vertical', ], },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: 'afda3b1', },
		{ graph: [ 'vertical', 'out', 'empty', 'out', ], },
		{ graph: [ 'commit', 'empty', 'vertical', ], commit: '92e1a35', },
		{ graph: [ 'vertical', 'back', 'empty', 'back', ], },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: '156759c', },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: '94efca0', },
		{ graph: [ 'commit', 'empty', 'vertical', 'empty', 'vertical', ], commit: '03279f7', },
		{ graph: [ 'vertical', 'back', 'empty', 'back', 'empty', 'back', ], },
		{ graph: [ 'vertical', 'empty', 'vertical', 'out', 'empty', 'out', ], },
		{ graph: [ 'vertical', 'out', 'vertical', 'empty', 'vertical', ], },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: 'fd52b44', },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: '4127be9', },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: '30a80af', },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: 'e677d5f', },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: '2723b07', },
		{ graph: [ 'vertical', 'empty', 'commit', 'empty', 'vertical', ], commit: 'bf7ccbe', },
		{ graph: [ 'vertical', 'out', 'empty', 'out', ], },
		{ graph: [ 'vertical', 'empty', 'commit', ], commit: '875de8a', },
	];
};
