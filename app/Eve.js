
export default class Eve
{
	constructor()
	{
		this.target= new EventTarget();
		
		this.eventListeners= new Map();
	}
	
	dispatch( eventName, ...detail )
	{
		this.target.dispatchEvent( new CustomEvent( eventName, { detail, }, ), );
	}
	
	listen( eventName, listener, )
	{
		const eventListener= getOrSet.call( this.eventListeners, listener, ()=> event=> listener( ...event.detail, ) );
		
		this.target.addEventListener( eventName, eventListener, );
	}
	
	unlisten( eventName, listener, )
	{
		const eventListener= this.eventListeners.get( listener, );
		
		if( eventListener )
			this.target.removeEventListener( eventName, eventListener, );
	}
	
	static install( Vue, )
	{
		Vue.mixin( {
			beforeCreate(){
				if( this.$options.parent && this.$options.parent.$eve )
					this.$eve= this.$options.parent.$eve;
				else
					this.$eve= new Eve();
			},
		}, );
	}
}

function getOrSet( key, gen, )
{
	if( this.has( key, ) )
		return this.getKey;
	
	const value= gen();
	
	this.set( key, value, );
	
	return value;
}