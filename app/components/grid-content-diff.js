import scrollingList from './scrolling-list.js';
import highLight from './high-light.js';
import { diffFileOnIndex, } from '../git-data.js';
import { ext2mime, } from '../modules.js';
import { deepAssign, multipleReduce, } from '../modules.js';
import { move, } from '../mouse-moving.js';

export default {
	
	render( _, ){
		const renderColumn= ( column, followStops=undefined, )=> {
			let lineIndex= 0;
			
			return _( 'div', { class:{ 'diff-column':1, focus:(column === 'left')^(this.focusRight), }, on:{
				wheel: e=> {
					if( this.scrolling.moving )
						return;
					if( e.deltaY < 0 )
						this.toPrev();
					else
						this.toNext();
				},
				mousedown: this.mousedown,
			}, }, [
				_( 'header', {}, [ _( 'span', {}, this[column].file, ), ], ),
				_( 'section', { class:'scroll-container', }, [
					_( 'ul', {
						class: [ 'scroll-body', 'content-area', ],
						style: {
							'--scroll-top': this[`${column}ScrollTop`],
							'--scroll-left': this.scrolling.x,
							'--move-top': this.scrolling.moveY,
							'--move-left': this.scrolling.moveX,
							'--move-transition': this.scrolling.moveTransition/this.scrolling.moveSpeed,
						},
					}, [
						(++lineIndex, ''),
						_( 'div', { class:[ 'linker-gap', 'fixed-horizontal', ], }, ),
						_( 'li', { class:[ 'gap', 'horizontal-through', 'fixed-horizontal', ], }, ),
						...this[column].hunks.map(
							hunk=> [
								...hunk.pieces.map(
									piece=> {
										const diff= this[`${column}FollowDiff`];
										return _( 'li', { class:{
											piece: 1,
											added: piece.added,
											deleted: piece.deleted,
											focus: (
												this[`${column}FocusStop`] && (
													(piece.added && this[`${column}FocusStop`].stop === piece.addedStop)
													||
													(piece.deleted && this[`${column}FocusStop`].stop === piece.deletedStop)
												)
											),
										}, on:{
											click:()=> {
												if( column === 'left' )
												{
													if( piece.added )
														this.focusTo( piece.addedStop, );
												}
												else
												if( column === 'middle' )
												{
													if( piece.deleted )
														this.focusTo( piece.deletedStop, );
													else
													if( piece.added )
														this.focusTo( piece.addedStop, true, );
												}
												else
												if( column === 'right' )
												{
													if( piece.deleted )
														this.focusTo( piece.deletedStop, true, );
												}
											}
										}, }, [
											...(!(followStops && piece.deleted)? []: [
											]),
											_( 'header', { class:[ 'boundary', 'horizontal-through', 'fixed-horizontal', ], }, !(followStops && followStops.length && piece.deleted)? []: [
												_( 'svg', {
													class: [
														'svg-linker',
													],
													style: {
														'--height': (
															Math.max( followStops[piece.deletedStop].end - diff, lineIndex - - piece.lines.length, )
															-
															Math.min( followStops[piece.deletedStop].start - diff, lineIndex, )
														),
														'--offset': Math.min( 0, (followStops[piece.deletedStop].start - diff) - lineIndex, ),
													},
													attrs: {
														// viewBox: '0 0 8 8',
													},
												}, [
													_( 'linearGradient', { class:'gradient', attrs:{ id:`svg-lg-${lineIndex}`, x1:'0%', y1:'0%', x2:'100%', y2:'0%', spreadMethod:'pad', }, }, [
														_( 'stop', { attrs:{ offset:'0%', }, }, ),
														_( 'stop', { attrs:{ offset:'50%', }, }, ),
														_( 'stop', { attrs:{ offset:'100%', }, }, ),
													], ),
													_( 'path', {
														class: 'linker-body',
														attrs: {
															fill: `url(#svg-lg-${lineIndex})`,
															d: `
																M 0 ${Math.max( 0, this.lineHeight*((followStops[piece.deletedStop].start - diff) - lineIndex), )}
																c
																	${this.linkerWidth/2} 0
																	${this.linkerWidth/2} ${this.lineHeight*(lineIndex - (followStops[piece.deletedStop].start - diff))}
																	${this.linkerWidth}   ${this.lineHeight*(lineIndex - (followStops[piece.deletedStop].start - diff))}
																l 0 1
																l 0 ${this.lineHeight*piece.lines.length}
																c
																	-${this.linkerWidth/2} 0
																	-${this.linkerWidth/2} ${this.lineHeight*(followStops[piece.deletedStop].end - diff - lineIndex - piece.lines.length)}
																	-${this.linkerWidth}   ${this.lineHeight*(followStops[piece.deletedStop].end - diff - lineIndex - piece.lines.length)}
																z
															`,
														},
													}, ),
												], ),
												_( 'span', { class:[
													'linker',
													(
														(followStops[piece.deletedStop].start - diff) < lineIndex? 'grow':
														(followStops[piece.deletedStop].start - diff) > lineIndex? 'drop':
														'plane'
													),
												], style:{
													'--height': Math.abs( (followStops[piece.deletedStop].start - diff) - lineIndex, ),
												}, }, ),
											], ),
											...piece.lines.map(
												line=> _( 'div', { class:'line', }, [
													(++lineIndex, ''),
													_( 'header', { class:[ 'linker-gap', 'fixed-horizontal', ], }, ),
													_( 'span', { class:[ 'line-number', 'fixed-horizontal', ], }, line.num, ),
													_( 'high-light', { class:'content', props:{ mime:getMIME( this[column].file, ), content:line.content, }, }, ),
												], ),
											),
											_( 'footer', { class:[ 'boundary', 'horizontal-through', 'fixed-horizontal', ], }, !(followStops && followStops.length && piece.deleted)? []: [
												_( 'span', { class:[
													'linker',
													(
														(followStops[piece.deletedStop].end - diff) < lineIndex? 'grow':
														(followStops[piece.deletedStop].end - diff) > lineIndex? 'drop':
														'plane'
													),
												], style:{
													'--height': Math.abs( (followStops[piece.deletedStop].end - diff) - lineIndex, ),
												}, }, ),
											], ),
										], );
									},
								),
								(++lineIndex, ''),
								_( 'div', { class:[ 'linker-gap', 'fixed-horizontal', ], }, ),
								_( 'li', { class:[ 'gap', 'horizontal-through', 'fixed-horizontal', ], }, ),
							],
						),
					], ),
				], ),
			], );
		};
		
		const vdom= _( 'section', { class:{ 'grid-item':true, 'content-diff':true, focus:this.focused, }, }, (
			this.file?
			[
				renderColumn( 'left', ),
				renderColumn( 'middle', this.stops.left.added,  ),
				renderColumn( 'right',  this.stops.right.added, ),
				
			]:
			[
				_( 'div', { class:'diff-column', style:{ opacity:'0', }, }, ),
				_( 'div', { class:'diff-column', style:{ opacity:'0', }, }, [
					_( 'header', {}, ),
					_( 'section', { class:'scroll-container', }, [
						_( 'ul', {
							class: [ 'scroll-body', 'content-area', ],
						}, [
							_( 'div', { class:[ 'linker-gap', 'fixed-horizontal', ], }, ),
							_( 'li', { class:[ 'gap', 'horizontal-through', 'fixed-horizontal', ], }, ),
						], ),
					], ),
				], ),
			]
		), );
		
		return vdom;
	},
	
	components: { scrollingList, highLight, },
	
	props: {
		focused: {
			type: Boolean,
			default: false,
		},
	},
	
	data: ()=> ({
		file: undefined,
		left:   undefined,
		middle: undefined,
		right:  undefined,
		stops: {
			left:   { added:[], deleted:[], },
			right:  { added:[], deleted:[], },
		},
		focusRight: false,
		focusStop: 0,
		pageSize: 1,
		lineHeight: 1,
		linkerWidth: 1,
		scrolling: {
			moving: false,
			x: 0,
			y: 0,
			moveX: 0,
			moveY: 0,
			moveSpeed: 0.5,
			moveTransition: 600,
		},
	}),
	
	computed: {
		leftScrollTop(){
			if( this.left.lineCount < this.pageSize )
				return (this.left.lineCount - this.pageSize)/2 - - this.scrolling.y;
			else
			{
				const stop= this.leftFocusStop;
				if( !stop )
					return this.scrolling.y;
				
				return Math.max( -Infinity, stop.start - - Math.min( this.pageSize - 3, stop.end - stop.start, )/2 - (this.pageSize - 1)*0.5, ) - - this.scrolling.y;
			}
		},
		
		middleScrollTop(){
			if( this.middle.lineCount < this.pageSize )
				return (this.middle.lineCount - this.pageSize)/2 - - this.scrolling.y;
			else
			{
				const stop= this.middleFocusStop;
				if( !stop )
					return this.scrolling.y;
				
				return Math.max( -Infinity, stop.start - - Math.min( this.pageSize, stop.end - stop.start, )/2 - (this.pageSize - 1)*0.5, ) - - this.scrolling.y;
			}
		},
		
		rightScrollTop(){
			if( this.right.lineCount < this.pageSize )
				return (this.right.lineCount - this.pageSize)/2 - - this.scrolling.y;
			else
			{
				const stop= this.rightFocusStop;
				if( !stop )
					return this.scrolling.y;
				
				return Math.max( -Infinity, stop.start - - Math.min( this.pageSize, stop.end - stop.start, )/2 - (this.pageSize - 1)*0.5, ) - - this.scrolling.y;
			}
		},
		
		focusSide(){
			return this.focusRight? 'right': 'left';
		},
		
		leftFocusStop(){
			if( !this.focusRight )
				return this.stops.left.added[this.focusStop];
			else
				return this.stops.right.added[this.focusStop];
		},
		
		middleFocusStop(){
			if( !this.focusRight )
				return this.stops.left.deleted[this.focusStop];
			else
				return this.stops.right.added[this.focusStop];
		},
		
		rightFocusStop(){
			if( !this.focusRight )
				return this.stops.left.deleted[this.focusStop];
			else
				return this.stops.right.deleted[this.focusStop];
		},
		
		middleFollowDiff(){
			return this.leftScrollTop - this.middleScrollTop;
		},
		
		rightFollowDiff(){
			return this.middleScrollTop - this.rightScrollTop;
		},
	},
	
	methods: {
		async diffFile( file, toFile, ){
			const diff= await diffFileOnIndex( file, toFile, );
			
			this.file= file;
			
			this.left= diff.left;
			this.middle= diff.middle;
			this.right= diff.right;
			
			this.loadStops();
			
			await timeout();
			
			this.resize();
		},
		
		loadStops(){
			
			fillStops( this.left.hunks,   this.stops.left.added, );
			fillStops( this.middle.hunks, this.stops.right.added, this.stops.left.deleted,  );
			fillStops( this.right.hunks,  undefined,              this.stops.right.deleted, );
			
			// multipleReduce(
			// 	{
			// 		compare: ( x, y, )=> x.start - - x.end <= y.start - - y.end,
			// 		proceed: ( courier, item, n, i, )=> {
			// 			if( n === 0 )
			// 				this.stops.push( {
			// 					side: 'left',
			// 					leftStart: stops.left.added[i].start,
			// 					leftEnd: stops.left.added[i].end,
			// 					middleStart: item.start,
			// 					middleEnd: item.end,
			// 					rightStart: item.start,
			// 					rightEnd: item.end,
			// 				}, );
			// 			else
			// 			if( n === 1 )
			// 				this.stops.push( {
			// 					side: 'right',
			// 					leftStart: item.start,
			// 					leftEnd: item.end,
			// 					middleStart: item.start,
			// 					middleEnd: item.end,
			// 					rightStart: stops.right.deleted[i].start,
			// 					rightEnd: stops.right.deleted[i].end,
			// 				}, );
			// 		},
			// 	},
			// 	stops.middle.deleted,
			// 	stops.middle.added,
			// );
		},
		
		focusTo( stop, toRight=false, ){
			this.focusStop= stop;
			this.focusRight= toRight;
		},
		
		toHome(){
			this.focusTo( 0, );
		},
		toEnd(){
			this.focusTo( this.stops[this.focusSide].added.length - 1, );
		},
		
		toNext( step=1, ){
			if( this.focusStop < this.stops[this.focusSide].added.length - step )
				this.focusStop-=- step;
		},
		
		toPrev( step=1, ){
			if( this.focusStop >= step )
				this.focusStop-= step;
		},
		
		resize(){
			const rect= this.$el.querySelector( '.diff-column:not(:first-child) .scroll-container', ).getBoundingClientRect();
			const linkerGap= this.$el.querySelector( '.diff-column:not(:first-child) .linker-gap', );
			
			if( linkerGap )
			{
				const linkerRect= linkerGap.getBoundingClientRect();
				this.linkerWidth= linkerRect.width;
				this.lineHeight= linkerRect.height;
				this.pageSize= Math.round( rect.height/linkerRect.height, );
			}
		},
		
		keydown( key, ){
			let effective= false;
			
			for( let ref in this.$refs )
			{
				const vdom= this.$refs[ref];
				
				effective|= vdom.keydown( key, )
			}
			
			if( effective )
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
			}
		},
		
		keyup( key, ){
			let effective= false;
			
			for( let ref in this.$refs )
			{
				const vdom= this.$refs[ref];
				
				effective|= vdom.keyup( key, )
			}
			
			if( effective )
				return true;
		},
		
		blur(){
			for( let ref in this.$refs )
				this.$refs[ref].pieceViewMove();
			
			this.$emit( 'blur', );
		},
		
		mousedown( event, ){
			switch( event.buttons )
			{
				case 4: /* Middle */
					this.freeMove();
					this.$eve.dispatch( 'move-scrolling-list', this, );
				break;
			}
		},
		
		increaseMoveSpeed(){
			if( this.scrolling.moveSpeed < 8 )
				this.scrolling.moveSpeed*= Math.SQRT2;
		},
		decreaseMoveSpeed(){
			if( this.scrolling.moveSpeed > 1/8 )
				this.scrolling.moveSpeed*= Math.SQRT1_2;
		},
		
		async freeMove(){
			this.scrolling.moving= true;
			this.scrolling.moveTransition= 0;
			
			const clickChangeSpeed= event=> {
				switch( event.buttons )
				{
				case 5:
				{
					this.increaseMoveSpeed();
					event.stopPropagation();
				}
				break;
				case 6:
				{
					this.decreaseMoveSpeed();
					event.stopPropagation();
				}
				break;
				}
			};
			
			const wheelChangeSpeed= event=> {
				if( event.deltaY > 0 )
					this.decreaseMoveSpeed();
				else
				if( event.deltaY < 0 )
					this.increaseMoveSpeed();
			};
			
			document.addEventListener( 'mousedown', clickChangeSpeed, { capture: true, }, );
			document.addEventListener( 'wheel', wheelChangeSpeed, );
			
			await move( ( { movementX, movementY, }, )=> {
				this.scrolling.moveX= Math.max( 0, this.scrolling.moveX - movementX*this.scrolling.moveSpeed, );
				this.scrolling.moveY-= movementY*this.scrolling.moveSpeed;
			}, 4, );
			
			document.removeEventListener( 'mousedown', clickChangeSpeed, { capture: true, }, );
			document.removeEventListener( 'wheel', wheelChangeSpeed, );
			
			this.scrolling.moving= false;
			
			await timeout( 800, );
			
			if( !this.scrolling.moving )
			{
				this.scrolling.moveX= 0;
				this.scrolling.moveY= 0;
				this.scrolling.moveTransition= 600;
			}
		},
	},
	
	mounted(){
		this.resize();
		this.$eve.listen( 'focus-to-file', this.diffFile, );
	},
	
	destroyed(){
		this.$eve.unlisten( 'focus-to-file', this.diffFile, );
	},
};

function getMIME( file, )
{
	return ext2mime( file||'.txt', );
}

function fillStops( hunks, addedStops, deletedStops, )
{
	let lineIndex= 1;
	
	if( addedStops )
		addedStops.splice( 0, );
	if( deletedStops )
		deletedStops.splice( 0, );
	
	for( let hunk of hunks )
	{
		for( let piece of hunk.pieces )
		{
			const stop= {
				start: lineIndex,
				end: (lineIndex - - piece.end - piece.start),
				startNum: piece.start,
				endNum: piece.end,
				stop: 0,
			};
			
			if( piece.added && addedStops )
			{
				pushStop( addedStops, stop, );
				
				stop.stop=
				piece.addedStop= addedStops.length - 1;
			}
			
			if( piece.deleted && deletedStops )
			{
				pushStop( deletedStops, stop, );
				
				stop.stop=
				piece.deletedStop= deletedStops.length - 1;
			}
			
			piece.lines.forEach( line=> ++lineIndex, );
		}
		
		++lineIndex;
	}
}

function pushStop( stops, stop, )
{
	const last= stops[stops.length - 1];
	
	if( last && last.endNum === stop.startNum )
	{
		last.end= stop.end;
		last.endNum= stop.endNum;
	}
	else
		stops.push( stop, );
	
}
