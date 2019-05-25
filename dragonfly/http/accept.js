import { ext2mime, } from './mime.js';

export class AcceptArray extends Array
{
	/**
	 * Construct a accept array
	 * 
	 * @param acceptString  (string)  Request header Accept
	 * @param ?path         (string)  Request path, for extension check
	 */
	constructor( acceptString, path='/', )
	{
		super();
		
		const ext= (x=> x? x[0]: '')( path.match( /\.\w+$/, ), );
		if( ext )
		{
			const mime= ext2mime( ext, );
			
			if( mime )
				this.push( new AcceptItem( mime, ), );
		}
		
		acceptString.split( ',', ).forEach( item=> {
			let [ mime, quality=1, ]= item.split( ';q=', );
			
			quality= Math.max( 0, Math.min( 1, +quality, ), );
			
			this.push( new AcceptItem( mime, quality, ), );
		}, );
		
		if( !this.length )
			this.push( new AcceptItem(), );
	}
	
	/**
	 * Match the mime for a match level.
	 * 
	 * @param mime (string)
	 * 
	 * @return (number)  match level
	 */
	match( mime, )
	{
		const [ type, subtype=null, ]= mime.split( '/', );
		
		if( !subtype )
			throw new Error( `MIME type ${mime} is invalid`, );
		
		return this.reduce( ( previous, item, )=> {
			const current= item.matchSplited( type, subtype, );
			
			return Math.max( previous, current, );
		}, 0, );
	}
	
	/**
	 * Convert accept to HTTP Request header string.
	 * 
	 * @return (string)
	 */
	toString()
	{
		return this.join( ',', );
	}
}

export class AcceptItem
{
	/**
	 * @type (string)
	 */
	#mime;
	
	/**
	 * @type (string)
	 */
	#type;
	
	/**
	 * @type (string)
	 */
	#subtype;
	
	/**
	 * @type (number)
	 */
	#quality;
	
	/**
	 * Construct a accept item
	 * 
	 * @param ?mime    (string)
	 * @param ?quality (number)
	 */
	constructor( mime='*/*', quality=1, )
	{
		this.#mime= mime;
		[ this.#type, this.#subtype=null, ]= mime.split( '/', );
		
		if( !this.#subtype )
			throw new Error( `MIME type ${mime} is invalid`, );
		
		this.#quality= quality;
	}
	
	/**
	 * Match the mime for a match level.
	 * 
	 * @param mime (string)
	 * 
	 * @return (number)  match level
	 */
	match( mime, )
	{
		const [ type, subtype=null, ]= mime.split( '/', );
		
		if( !subtype )
			throw new Error( `MIME type ${mime} is invalid`, );
		
		return this.matchSplited( type, subtype, );
	}
	
	/**
	 * Match the mime(type, subtype) for a match level.
	 * 
	 * @param type    (string)
	 * @param subtype (string)
	 * 
	 * @return (number)  match level
	 */
	matchSplited( type, subtype, )
	{
		if( this.#mime === '*/*' )
			return 1;
		else
		if( type !== this.#type )
			return 0;
		else
		if( this.#subtype === '*' )
			return 2
		else
		if( subtype !== this.#subtype )
			return 0;
		else
			return 4;
	}
	
	/**
	 * Convert accept item to HTTP Request header string.
	 * 
	 * @return (string)
	 */
	toString()
	{
		if( this.#quality===1 )
			return this.#mime;
		else
			return `${this.#mime};q=${this.#quality}`;
	}
}
