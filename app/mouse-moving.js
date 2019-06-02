
export async function move( onMove, buttonsValue=undefined, )
{
	return new Promise( resolve=> {
		
		document.body.requestPointerLock();
		
		const endMove= event=> {
			
			if( buttonsValue && event.buttons === buttonsValue )
				return;
			
			document.exitPointerLock();
			
			document.removeEventListener( 'mousemove', onMove, );
			document.removeEventListener( 'mouseup',   endMove, );
			
			resolve( event, );
		};
		document.addEventListener( 'mousemove', onMove, );
		document.addEventListener( 'mouseup',   endMove, );
	}, );
}
