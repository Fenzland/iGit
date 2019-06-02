import scrollingList from './scrolling-list.js';
import { getRefs, } from '../git-data.js';

export default {
	render( _, ){
		let mainIndex=0;
		const createNode= data=> {
			if( data.type === 'ref' )
			{
				const index= mainIndex++;
				
				if( this.focusLine === index )
					this.current= data;
				
				return _(
					'li',
					{
						class: {
							ref: 1,
							'ref-node': 1,
							focus: this.focusLine === index,
							highlight: data.ref.hash === this.focusedCommit,
						},
					},
					[
						_( 'a', { class: { title: 1, [`type-${data.ref.type}`]: 1, }, attrs: { title: data.ref.name, }, on:{ click:()=> this.focusTo( index, ), }, }, data.name ),
						...(
							!data.ref.symref? []:
							[
								_( 'span', { class: 'symref-operater', }, ' -> ', ),
								_( 'span', { class: 'symref', attrs: { title: data.ref.symref, }, }, this.refs.getRef( data.ref.symref, ).shortName, ),
							]
						),
					],
				);
			}
			else
			if( data.name )
			{
				const index= mainIndex++;
				
				if( this.focusLine === index )
					this.current= data;
				
				return _( 'li', { class: { 'ref-node': 1, 'ref-tree': 1, [`type-${data.type}`]: 1, focus: this.focusLine === index, }, }, [
					_( 'span', { class: 'title', on:{ click:()=> this.focusTo( index, ).then( ()=> this.toggleTree(), ), }, }, data.name, ),
					...(
						!data.opened? []:
						[ _( 'ul', { class: [ 'ref-list', ], }, Object.values( data.children, ).map( createNode, ), ), ]
					),
				], );
			}
			else
				return _( 'li', { class: [ 'ref-node', `type-${data.type}`, ], }, [
					_( 'ul', { class: [ 'ref-list', ], }, Object.values( data.children, ).map( createNode, ), ),
				], );
		};
		
		const vdom= _( 'scrolling-list', {
			ref: 'scrollingList',
			class: { 'grid-item': 1, refs: 1, focus: this.focused, },
			props: {
				'focus-line': this.focusLine,
				size: this.size,
				'page-size': this.pageSize,
			},
		}, this.refTree? [ createNode( this.refTree, ), ]: [], );
		
		this.size= mainIndex;
		
		return vdom;
	},
	
	components: { scrollingList, },
	
	props: {
		focused: {
			type: Boolean,
			default: false,
		},
	},
	
	data: ()=> ({
		refTree: undefined,
		focusedCommit: undefined,
		size: 1,
		focusLine: 0,
		pageSize: 1,
	}),
	
	computed: {
		scrollingList(){
			return this.$refs.scrollingList;
		},
	},
	
	methods: {
		focusToCommit( commit, ){
			this.focusedCommit= commit;
		},
		
		async focusTo( line, ){
			this.focusLine= line;
			
			await timeout();
			
			if( this.current.type === 'ref' )
			{
				this.$eve.dispatch( 'focus-to-commit', this.current.ref.hash, );
			}
		},
		
		toHome(){
			return this.focusTo( 0, );
		},
		toEnd(){
			return this.focusTo( this.size - 1, );
		},
		toNext( line=1, ){
			return this.focusTo( Math.min( this.size - 1, this.focusLine - - line, ), );
		},
		toPrev( line=1, ){
			return this.focusTo( Math.max( 0, this.focusLine - line, ), );
		},
		toNextPage( page=0.5, ){
			return this.focusTo( Math.min( this.size - 1, this.focusLine - - Math.round( page*this.pageSize, ), ), );
		},
		toPrevPage( page=0.5, ){
			return this.focusTo( Math.max( 0, this.focusLine - Math.round( page*this.pageSize, ), ), );
		},
		
		openTree(){
			if( this.current.type === 'tree' && !this.current.opened )
			{
				this.current.opened= true;
				this.$forceUpdate();
			}
		},
		closeTree(){
			if( this.current.type === 'tree' && this.current.opened )
			{
				this.current.opened= false;
				this.$forceUpdate();
			}
		},
		toggleTree(){
			if( this.current.type === 'tree' )
			{
				this.current.opened= !this.current.opened;
				this.$forceUpdate();
			}
		},
		
		resize(){
			const dom= this.$el;
			const rect= dom.getBoundingClientRect();
			const lineRect= dom.querySelector( '.ref.ref-node', ).getBoundingClientRect();
			this.pageSize= Math.round( rect.height/lineRect.height, );
		},
		
		keydown( key, ){
			if( this.scrollingList.keydown( key, ) )
				return true;
			
			switch( key.key )
			{
				case 'Escape': return this.blur(), true;
				
				case 'ArrowUp': return this.toPrev(), true;
				case 'ArrowDown': return this.toNext(), true;
				case 'ArrowLeft': return this.closeTree(), true;
				case 'ArrowRight': return this.openTree(), true;
				
				case 'PageUp': return this.toPrevPage(), true;
				case 'PageDown': return this.toNextPage(), true;
				
				case 'Home': return this.toHome(), true;
				case 'End': return this.toEnd(), true;
			}
		},
		
		keyup( key, ){
			if( this.scrollingList.keyup( key, ) )
				return true;
		},
		
		blur(){
			this.scrollingList.stopViewMove();
			this.$emit( 'blur', );
		},
		
		onWindowBlur(){
			this.scrollingList.stopViewMove();
		},
	},
	
	async mounted(){
		this.$eve.listen( 'focus-to-commit', this.focusToCommit, );
		
		const refs= await getRefs();
		
		this.refs= refs;
		this.refTree= refs.tree;
		
		this.refTree.children.heads.opened= true;
		this.refTree.children.remotes.opened= true;
		
		await timeout();
		
		this.resize();
	},
	
	destroyed()
	{
		this.$eve.unlisten( 'focus-to-commit', this.focusToCommit, );
	},
	
};
