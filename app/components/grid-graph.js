import scrollingList from './scrolling-list.js';
import { getGraph, appendGraph, } from '../git-data.js';

const template= /*HTML*/`
<scrolling-list ref="scrollingList" :class="{ 'grid-item': 1, graph: 1, focus: focused, }" :focus-line="scrollCenterLine" :size="graph.length" :page-size="pageSize" :init-offset="-0.5">
	<template v-for="( line, index ) of graph">
		<li :class="{
			line: 1,
			focus: focusLine === index,
			'parent-focus': line.parents && line.parents.some( parent=> parent.commit === currentCommit, ),
			'child-focus': line.children && line.children.some( child=> child.commit === currentCommit, ),
		}">
			<span class="graph-node-wrapper" :style="{ '--offset': line.column, '--width': line.width, }">
				<template v-for="child of line.children">
					<span
						:class="{
							'tie': 1,
							'up': child.x === 0 && child.dx === 0,
							'right-up-left': child.x >= 0 && child.dx < child.x,
							'right-up-right': child.x >= 0 && child.dx > child.x,
							'left-up-right': child.x < 0 && child.dx > child.x,
							'left-up-left': child.x < 0 && child.dx < child.x,
							'lineal-right': child.x > 0 && child.dx === child.x,
							'lineal': child.lineal,
							'parent-focus': focusLine === index,
							'child-focus': focusLine === index - - child.dy,
						}"
						:style="{
							'--x': child.x,
							'--dx': child.dx,
							'--dy': child.dy,
							'--abs-dx': Math.abs( child.dx, ),
							'--abs-dy': Math.abs( child.dy, ),
						}"
					></span>
				</template>
				<a
					href="javascript:;"
					class="graph-node"
					:title="line.commit.hash"
					v-on:click="event=> mouseFocusTo( event, index, )"
				></a>
			</span>
			
			<a
				href="javascript:;"
				class="commit"
				:title="line.commit.hash"
				v-on:click="event=> mouseFocusTo( event, index, )"
			>
				{{ line.commit.shortHash }}
			</a>
			<span>{{ line.commit.title }}</span>
			<template v-if="line.commit.refs">
				<span class="ref-list">
					<template v-for="ref of line.commit.refs">
						<span :class="[ 'ref', \`type-\${ref.type}\`, ]" :title="ref.name">{{ ref.shortName }}</span>
					</template>
				</span>
			</template>
		</li>
	</template>
	<template v-if="threads.length">
		<li class="line threads">
			<template v-for="( thread, index ) of threads">
				<span class="graph-node-wrapper">
					<template v-if="thread">
						<span
							:class="{
								'tie': 1,
								'up': index === thread.column,
								'up-left': index > thread.column,
								'up-right': index < thread.column,
								'lineal': thread.lineal,
								'parent-focus': 0,
								'child-focus': focusLine === thread.row,
							}"
							:style="{
								'--x': thread.column,
								'--dx': thread.column - index,
								'--dy': thread.row - graph.length,
								'--abs-dx': index - thread.column,
								'--abs-dy': graph.length - thread.row,
							}"
						></span>
					</template>
				</span>
			</template>
		</li>
	</template>
	<template v-slot:footer>
		<template v-if="graph.length && currentCommit">
			<div :class="{ detail: 1, show: detailShown, }">
				<p class="hash"><span class="short-hash">{{ currentCommit.shortHash }}</span>{{ currentCommit.hash.slice( currentCommit.shortHash.length, ) }}</p>
				<template v-if="currentCommit.refs">
					<p class="ref-list">
						<template v-for="ref of currentCommit.refs">
							<span class="ref">{{
								ref.name.slice( 0, -ref.shortName.length, )
								}}<span :class="\`type-\${ref.type}\`" :title="ref.name">{{ ref.shortName }}</span>
							</span>
						</template>
					</p>
				</template>
				<p>{{ currentCommit.title }}</p>
				<pre>{{ currentCommit.body }}</pre>
				<div class="author">
					<p>{{ currentCommit.author.name }} &lt;<a :href="\`mailto:\${currentCommit.author.email}\`">{{ currentCommit.author.email }}</a>&gt;</p>
					<p>{{ formatTime( currentCommit.author.time, ) }}</p>
				</div>
			</div>
		</template>
	</template>
</scrolling-list>
`;


export default {
	template,
	
	components: { scrollingList, },
	
	props: {
		focused: {
			type: Boolean,
			default: false,
		},
	},
	
	data: ()=> ({
		graph: [],
		threads: [],
		focusLine: 0,
		scrollAtLine: 0,
		pageSize: 1,
		detailShown: true,
	}),
	
	computed: {
		currentLine(){
			return this.graph[this.focusLine];
		},
		
		currentCommit(){
			return this.currentLine.commit;
		},
		
		scrollingList(){
			return this.$refs.scrollingList;
		},
		
		scrollCenterLine(){
			if( !this.graph.length )
				return 0;
			
			const { parents, children, }= this.graph[this.scrollAtLine];
			
			return (
				this.scrollAtLine
				- -
				parents.reduce( ( sum, parent, )=> sum - - Math.min( parent.dy, this.pageSize, ), 1, )/(parents.length - - 1)
				- -
				children.reduce( ( sum, child, )=> sum - - Math.max( child.dy, -this.pageSize, ), -1, )/(children.length - - 1)
			);
		},
	},
	
	methods: {
		focusTo( line, scrollTo=true, ){
			this.focusLine= line;
			
			if( scrollTo )
				this.scrollAtLine= line;
			
			this.$eve.dispatch( 'focus-to-commit', this.currentCommit.hash, );
			
			if( line > this.graph.length - this.pageSize )
				this.getMore();
		},
		
		scrollToFocus(){
			this.scrollAtLine= this.focusLine;
		},
		
		focusToCommit( commit, ){
			if( this.currentCommit.hash === commit )
				return;
			
			const line= this.graph.findIndex( graphLine=> graphLine.commit.hash === commit, );
			
			if( line >= 0 )
				this.focusTo( line, );
		},
		
		async getMore(){
			return this.$getting= (async start=> {
				const getting= await this.$getting;
				
				if( getting >= start )
					return;
				
				if( this.$graph.isEnded )
					return;
				
				await appendGraph( this.$graph, { start:this.graph.length, }, );
				
				return start;
			})( this.graph.length, );
			
		},
		
		toHome(){
			return this.focusTo( 0, );
		},
		toEnd(){
			return this.focusTo( this.graph.length - 1, );
		},
		toNext( line=1, ){
			this.focusTo( Math.min( this.graph.length - 1, this.focusLine - - line, ), false, );
			
			if( this.focusLine - this.scrollAtLine > this.pageSize*0.4375 )
				this.scrollToFocus();
		},
		toPrev( line=1, ){
			this.focusTo( Math.max( 0, this.focusLine - line, ), false, );
			
			if( this.scrollAtLine - this.focusLine > this.pageSize*0.4375 )
				this.scrollToFocus();
		},
		toNextPage( page=0.5, ){
			return this.focusTo( Math.min( this.graph.length - 1, this.focusLine - - Math.round( page*this.pageSize, ), ), );
		},
		toPrevPage( page=0.5, ){
			return this.focusTo( Math.max( 0, this.focusLine - Math.round( page*this.pageSize, ), ), );
		},
		
		showDetail(){
			this.detailShown= true;
		},
		hideDetail(){
			this.detailShown= false;
		},
		toggleDetail(){
			this.detailShown= !this.detailShown;
		},
		
		resize(){
			const dom= this.$el;
			const rect= dom.getBoundingClientRect();
			const lineRect= dom.firstElementChild.firstElementChild.getBoundingClientRect();
			this.pageSize= Math.round( rect.height/lineRect.height, ) - - (this.threads.length? 1: 0);
		},
		
		keydown( key, ){
			if( this.scrollingList.keydown( key, ) )
				return true;
			
			switch( key.key )
			{
				case 'Escape': return this.blur(), true;
				
				case 'ArrowUp':   return this.toPrev(), true;
				case 'ArrowDown': return this.toNext(), true;
				
				case 'PageUp':    return this.toPrevPage(), true;
				case 'PageDown':  return this.toNextPage(), true;
				
				case 'Home': return this.toHome(), true;
				case 'End':  return this.toEnd(), true;
				
				case 'd': this.toggleDetail(); break;
			}
		},
		
		keyup( key, ){
			if( this.scrollingList.keyup( key, ) )
				return true;
			
			switch( key.key )
			{
				case 'ArrowUp':
				case 'ArrowDown':
				case 'PageUp':
				case 'PageDown':
				case 'Home':
				case 'End':
					return this.scrollToFocus(), true;
				
				case 'd': this.toggleDetail(); break;
			}
		},
		
		blur(){
			this.scrollingList.stopViewMove();
			this.$emit( 'blur', );
		},
		
		onWindowBlur(){
			this.scrollingList.stopViewMove();
		},
		
		mouseFocusTo( event, index, ){
			this.focusTo( index, false, );
			
			let eventTarget= event.target;
			let timeoutId;
			
			const resetTimeout= ()=> {
				if( timeoutId )
					clearTimeout( timeoutId, );
				
				timeoutId= setTimeout( ()=> {
					this.scrollToFocus();
					
					eventTarget.removeEventListener( 'mouseout', leave, );
				}, 1500, );
			}
			
			const leave= ( { movementX, movementY, target, toElement, }, )=> {
				
				const movementSq= movementX*movementX - - movementY*movementY;
				
				if( movementSq < 25 && toElement && toElement.matches( '.graph a.commit', ) )
				{
					toElement.addEventListener( 'mouseout', leave, );
					eventTarget= toElement;
					
					resetTimeout();
				}
				else
				{
					clearTimeout( timeoutId, );
					
					this.scrollToFocus();
				}
				
				target.removeEventListener( 'mouseout', leave, );
			};
			
			event.target.addEventListener( 'mouseout', leave, );
			
			resetTimeout();
		},
	},
	
	async mounted(){
		this.$eve.listen( 'focus-to-commit', this.focusToCommit, );
		
		this.$graph= await getGraph();
		this.graph= this.$graph.graph;
		this.threads= this.$graph.threads;
		
		await timeout();
		
		this.toHome();
		this.resize();
	},
	
	destroyed()
	{
		this.$eve.unlisten( 'focus-to-commit', this.focusToCommit, );
	},
};
