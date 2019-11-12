import { ele, txt, newReact, } from '/web/butterfly/src/butterfly.js';
import { move, } from '../mouse-moving.js';

/**
 * 
 * @param 0.focusLine <(number)|$(number)>
 * @param 0.size      <(number)|$(number)>
 * @param 0.
 * @param children    
 * 
 * @return []{Node}
 */
export default function makeScrollList( {
	focusLine=0,
	size=1,
	pageSize=1,
	gathering=1,
	initOffset=0,
	boundary:{ left=-Infinity, right=Infinity, top=-Infinity, bottom=Infinity, }={},
	movingResetDelay=600,
	classes=[],
}={}, children, )
{
	const moving= newReact( false, );
	const x= newReact( 0, );
	const y= newReact( 0, );
	const moveX= newReact( 0, );
	const moveY= newReact( 0, );
	
	const moveStart= async ()=> {
		moving.setValue( true, );
		
		await move( ( { movementX, movementY, }, )=> {
			moveX.setValue( Math.max( boundary.left, Math.min( boundary.right,  moveX - movementX*moveSpeed, ), ), );
			moveY.setValue( Math.max( boundary.top,  Math.min( boundary.bottom, moveY - movementY*moveSpeed, ), ), );
		}, 4, );
		
		moving.setValue( false, );
	};
	
	return [
		ele( 'section', { class:[ 'scroll-container', ...[ classes, ].flat(), ], }, { listeners:{ mousedown:{ Middle:moveStart, }, }, }, [
			ele( 'ul', { class:[ 'scroll-body', ], }, {}, [
			
			], ),
		], ),
	];
}
