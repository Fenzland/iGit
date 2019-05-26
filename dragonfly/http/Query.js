
export default class Query
{
	/**
	 * @type {}
	 */
	#data;
	
	/**
	 * @type {URLSearchParams}
	 */
	#searchParams;
	
	/**
	 * Construct a HTTP query
	 * 
	 * @param ...params <mixed>
	 */
	constructor( ...params )
	{
		this.#data= {};
		this.#searchParams= new URLSearchParams();
		
		new URLSearchParams( ...params, ).forEach( ( value, name, )=> this.set( name, value, ), );
	}
	
	/**
	 * Set value.
	 * 
	 * @param name  (string)
	 * @param value (string)
	 * 
	 * @return <void>
	 */
	set( name, value, )
	{
		const keys= name.split( '[' ).map( key=> key.replace( ']', '', ), );
		
		deeplySet( { data:this.#data, }, 'data', keys, value, );
		
		if( keys.pop() === '' && Array.isArray( deeplyGet( this.#data, keys, ), ) )
			this.#searchParams.append( name, value, );
		else
		{
			this.#searchParams.delete( name.replace( /\[\]$/, '', ), );
			this.#searchParams.set( name, value, );
		}
	}
	
	/**
	 * Delete value.
	 * 
	 * @param name  (string)
	 * 
	 * @return <void>
	 */
	delete( name, )
	{
		const keys= name.split( '[' ).map( key=> key.replace( ']', '', ), );
		
		deeplyDelete( { data:this.#data, }, 'data', keys, );
		
		this.#searchParams.delete( name, );
	}
	
	/**
	 * Get value.
	 * 
	 * @param name  (string)
	 * @param deflt <any>
	 * 
	 * @return (string)
	 */
	get( name, deflt=undefined, )
	{
		const keys= name.split( '[' ).map( key=> key.replace( ']', '', ), );
		
		return deeplyGet( this.#data, keys, ) || deflt;
		
		if( name.endsWith( '[]', ) )
			return this.#searchParams.getAll( name, );
		else
			return this.#searchParams.get( name, ) || deflt;
	}
	
	/**
	 * Get the entries iterator
	 * 
	 * @return ...[(string),(string)]
	 */
	entries()
	{
		return this.#searchParams.entries();
	}
	
	/**
	 * Get the keys iterator
	 * 
	 * @return ...(string)
	 */
	keys()
	{
		return this.#searchParams.keys();
	}
	
	/**
	 * Get the values iterator
	 * 
	 * @return ...(string)
	 */
	values()
	{
		return this.#searchParams.values();
	}
	
	/**
	 * Iterate through the entries
	 * 
	 * @param callback (string),(string),{Query}=>
	 * @param context  {}
	 * 
	 * @return <void>
	 */
	forEach( callback, context, )
	{
		return this.#searchParams.forEach(
			( value, key, )=> callback( value, key, this, ),
			context,
		);
	}
	
	/**
	 * Get the entries iterator
	 * 
	 * @return (string)
	 */
	toString()
	{
		return this.#searchParams.toString();
	}
}

/**
 * Get a subject from a deep object via a key array
 * 
 * @param  object {}
 * @param  keys   (string)[]
 * 
 * @return <any>
 */
function deeplyGet( object, keys, )
{
	keys= keys.concat();
	
	const currentKey= keys.shift();
	
	const currentValue= currentKey? object[currentKey]: object;
	
	if( keys.length )
		return deeplyGet( currentValue, keys, );
	else
		return currentValue;
}

/**
 * Set a subject into a deep object via a key array
 * 
 * @param  object     {}
 * @param  prevKeys   (string)
 * @param  keys       (string)[]
 * @param  value      <any>
 * 
 * @return void
 */
function deeplySet( object, prevKey, keys, value, )
{
	keys= keys.concat();
	
	const currentKey= keys.shift();
	
	if( currentKey==='' && !Array.isArray( object[prevKey], ) )
		object[prevKey]= [];
	else
	if( !object[prevKey] )
		object[prevKey]= {};
	
	if( keys.length )
		deeplySet( object[prevKey], currentKey, keys, value );
	else
	{
		if( currentKey )
			object[prevKey][currentKey]= value;
		else
			object[prevKey].push( value, );
	}
}

/**
 * Delete a subject from a deep object via a key array
 * 
 * @param  object     {}
 * @param  prevKeys   (string)
 * @param  keys       (string)[]
 * 
 * @return void
 */
function deeplyDelete( object, prevKey, keys, )
{
	keys= keys.concat();
	
	const currentKey= keys.shift();
	
	if( !object[prevKey] )
		return;
	
	if( keys.length )
		deeplySet( object[prevKey], currentKey, keys, value );
	else
		delete object[prevKey];
}
