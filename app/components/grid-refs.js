
const template= /*HTML*/`
<section :class="{ 'grid-item':true, refs:true, 'scroll-container':true, focus:focused, }">
	<ul>
		<li>work tree</li>
		<li>index</li>
		<li>HEAD -&gt; master</li>
		<template v-for="group of refs">
			<li>
				<span>{{ group.name }}</span>
				<ul>
					<template v-for="ref of group.refs">
						<li>
							<span>{{ ref.name }}</span>
						</li>
					</template>
				</ul>
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
		head: { type: 'tag', name: 'master', },
		refs: [
			{
				name: 'local',
				category: 'local',
				refs: [
					{ name: 'master', },
					{ name: 'feature', },
				],
			},
			{
				name: 'origin',
				category: 'remote',
				refs: [
					{ name: 'master', },
					{ name: 'feature', },
				],
			},
			{
				name: 'tags',
				category: 'tags',
				refs: [
					{ name: '1.0.0', },
					{ name: '0.1.0', },
				],
			},
		],
	}),
	
	methods: {
		
		toHome(){
			for(
				let i= 0;
				i < this.refs.length;
				++i
			)if( this.refs[i].commit )
			{
				this.focusLine= i;
				
				return;
			}
		},
		toEnd(){
			for(
				let i= this.refs.length - 1;
				i >= 0;
				--i
			)if( this.refs[i].commit )
			{
				this.focusLine= i;
				
				return;
			}
		},
		toNext( line=1, ){
			for(
				let i= Math.min( this.refs.length - 1, this.focusLine - - line, );
				i < this.refs.length;
				++i
			)if( this.refs[i].commit )
			{
				this.focusLine= i;
				
				return;
			}
		},
		toPrev( line=1, ){
			for(
				let i= Math.max( 0, this.focusLine - line, );
				i >= 0;
				--i
			)if( this.refs[i].commit )
			{
				this.focusLine= i;
				
				return;
			}
		},
		toNextPage( page=0.5, ){
			for(
				let i= Math.min( this.refs.length - 1, this.focusLine - - Math.round( page*this.pageSize, ), );
				i < this.refs.length;
				++i
			)if( this.refs[i].commit )
			{
				this.focusLine= i;
				
				return;
			}
		},
		toPrevPage( page=0.5, ){
			for(
				let i= Math.max( 0, this.focusLine - Math.round( page*this.pageSize, ), );
				i >= 0;
				--i
			)if( this.refs[i].commit )
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
	},
};
