import { move, } from '../mouse-moving.js';

const template= /*HTML*/`
<section class="scroll-container" v-on:mousedown="mousedown">
	<ul class="scroll-body" :style="{ '--scroll-top':scrollTop, '--scroll-left':x, '--move-top':moveY, '--move-left':moveX, '--move-transition':moveTransition/moveSpeed, }">
		<slot></slot>
	</ul>
	<slot name="footer"></slot>
</section>
`;

export default {
	template,
	
	props: {
		focusLine: {
			type: Number,
			default: 0,
		},
		size: {
			type: Number,
			default: 1,
		},
		pageSize: {
			type: Number,
			default: 1,
		},
		gathering: {
			type: Number,
			default: 1,
			max: 1,
			min: 0,
		},
		initOffset: {
			type: Number,
			default: 0,
		},
		leftBoundary: {
			type: Number,
			default: -Infinity,
		},
		rightBoundary: {
			type: Number,
			default: Infinity,
		},
		topBoundary: {
			type: Number,
			default: -Infinity,
		},
		bottomBoundary: {
			type: Number,
			default: Infinity,
		},
		movingResetDelay: {
			type: Number,
			default: 600,
		},
	},
	
	data: ()=> ({
		moving: false,
		x: 0,
		y: 0,
		moveX: 0,
		moveY: 0,
		moveSpeed: 0.5,
		moveTransition: 100,
	}),
	
	computed: {
		
		scrollTop(){
			if( this.size < this.pageSize )
				return (this.size - this.pageSize)/2 - - this.y;
			else
				return Math.max( this.initOffset, this.focusLine - (this.pageSize - 1)*(this.focusLine/this.size*(1 - this.gathering) - - this.gathering/2), ) - - this.y;
		},
	},
	
	methods: {
		
		startViewMove(){
			this.moving= true;
		},
		stopViewMove(){
			this.moving= false;
			this.x= 0;
			this.y= 0;
		},
		moveLeft( step=1, ){
			this.x-= step;
		},
		moveRight( step=1, ){
			this.x+= step;
		},
		moveUp( step=1, ){
			this.y-= step;
		},
		moveDown( step=1, ){
			this.y+= step;
		},
		pageUp( page=0.5, ){
			this.y-= page*this.pageSize;
		},
		pageDown( page=0.5, ){
			this.y+= page*this.pageSize;
		},
		
		keydown( key, ){
			switch( key.key )
			{
				case 'ArrowLeft':
					if( this.moving )
						return this.moveLeft(), true;
				break;
				case 'ArrowRight':
					if( this.moving )
						return this.moveRight(), true;
				break;
				
				case 'ArrowUp':
					if( this.moving )
						return this.moveUp(), true;
				break;
				case 'ArrowDown':
					if( this.moving )
						return this.moveDown(), true;
				break;
				
				case 'PageUp':
					if( this.moving )
						return this.pageUp(), true;
				break;
				case 'PageDown':
					if( this.moving )
						return this.pageDown(), true;
				break;
				
				case 'Home':
					if( this.moving )
						return true;
				break;
				case 'End':
					if( this.moving )
						return true;
				break;
				
				case 'Alt':
					return this.startViewMove(), false;
				break;
			}
		},
		
		keyup( key, ){
			switch( key.key )
			{
				case 'Alt':
					return this.stopViewMove(), false;
				break;
			}
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
			if( this.moveSpeed < 8 )
				this.moveSpeed*= Math.SQRT2;
		},
		decreaseMoveSpeed(){
			if( this.moveSpeed > 1/8 )
				this.moveSpeed*= Math.SQRT1_2;
		},
		
		async freeMove(){
			this.move= true;
			this.moveTransition= 0;
			
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
				this.moveX= Math.max( this.leftBoundary, Math.min( this.rightBoundary,  this.moveX - movementX*this.moveSpeed, ), );
				this.moveY= Math.max( this.topBoundary,  Math.min( this.bottomBoundary, this.moveY - movementY*this.moveSpeed, ), );
			}, 4, );
			
			document.removeEventListener( 'mousedown', clickChangeSpeed, { capture: true, }, );
			document.removeEventListener( 'wheel', wheelChangeSpeed, );
			
			await timeout( this.movingResetDelay, )
			
			this.moving= false;
			this.moveX= 0;
			this.moveY= 0;
			this.moveTransition= 200;
		},
	},
};
