import scrollingList from './scrolling-list.js';
import { getChangedFiles, } from '../git-data.js';

const template= /*HTML*/`
<scrolling-list ref="scrollingList" :class="[ 'grid-item', 'changed-files', { focus:focused, }, ]" :focus-line="focusLine || 0" :size="data.length" :page-size="pageSize">
	<template v-if="data.length">
		<template v-for="( item, index ) of data">
			<li :class="[ 'line', { focus: focusLine === index, }, ]"
				><span :class="[ 'flag', 'staged', item.staged, ]"></span
				><span :class="[ 'flag', 'unstaged', item.unstaged, ]"></span
				><a class="file" v-on:click="focusTo( index, )">{{ item.file }}</a
				><template v-if="item.toFile"
					><span class="to-file">{{ item.toFile }}</span
				></template
			></li>
		</template>
	</template><template v-else>
		<li class="line clean">Nothing changed</li>
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
		data: [],
		focusLine: NaN,
		pageSize: 1,
	}),
	
	async mounted(){
		
		this.data= await getChangedFiles();
		
		await timeout();
		
		this.resize();
		
		await timeout( 1000, );
		
		// if( this.data.length )
		// 	this.focusTo( 0, );
	},
	
	computed: {
		current(){
			return this.data[this.focusLine];
		},
		
		scrollingList(){
			return this.$refs.scrollingList;
		},
	},
	
	methods: {
		focusTo( line, ){
			this.focusLine= line || 0;
			
			this.$eve.dispatch( 'focus-to-file', this.current.file, this.current.toFile, );
		},
		
		focusToFile( file, ){
			if( this.current.file === file )
				return;
			
			const line= this.data.find( item=> item.file === file, );
			
			if( line >= 0 )
				this.focusLine= line;
		},
		
		toDiff(){
			if( this.current )
				this.$eve.dispatch( 'grid-focus', 'content_diff', );
		},
		
		toHome(){
			return this.focusTo( 0, );
		},
		toEnd(){
			return this.focusTo( this.data.length - 1, );
		},
		toNext( line=1, ){
			return this.focusTo( Math.min( this.data.length - 1, this.focusLine - - line, ), );
		},
		toPrev( line=1, ){
			return this.focusTo( Math.max( 0, this.focusLine - line, ), );
		},
		toNextPage( page=0.5, ){
			return this.focusTo( Math.min( this.data.length - 1, this.focusLine - - Math.round( page*this.pageSize, ), ), );
		},
		toPrevPage( page=0.5, ){
			return this.focusTo( Math.max( 0, this.focusLine - Math.round( page*this.pageSize, ), ), );
		},
		
		resize(){
			const dom= this.$el;
			const rect= dom.getBoundingClientRect();
			const lineRect= dom.firstElementChild.firstElementChild.getBoundingClientRect();
			this.pageSize= Math.round( rect.height/lineRect.height, );
		},
		
		keydown( key, ){
			if( this.scrollingList.keydown( key, ) )
				return true;
			
			switch( key.key )
			{
				case 'd': return this.toDiff(), true;
				
				case 'Escape': return this.blur(), true;
				
				case 'ArrowUp':   return this.toPrev(), true;
				case 'ArrowDown': return this.toNext(), true;
				
				case 'PageUp':    return this.toPrevPage(), true;
				case 'PageDown':  return this.toNextPage(), true;
				
				case 'Home': return this.toHome(), true;
				case 'End':  return this.toEnd(), true;
			}
		},
		
		keyup( key, ){
			if( this.scrollingList.keyup( key, ) )
				return true;
		},
		
		blur(){
			this.scrollingList.stopViewMove();
			
			this.$emit( 'blur', );
			
			this.focusLine= NaN;
			
			this.$eve.dispatch( 'blur-file', );
		},
		
		onWindowBlur(){
			this.scrollingList.stopViewMove();
		},
	}
};
