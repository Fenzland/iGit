
globalThis.z= ( x, ...a )=> (console.log( x, ...a, ), x);

globalThis.timeout= ( time, value, )=> new Promise( resolve=> setTimeout( ()=> resolve( value, ), time, ), );
globalThis.nextFrame= value=> new Promise( resolve=> requestAnimationFrame( ()=> resolve( value, ), ), );
