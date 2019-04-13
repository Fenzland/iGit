
export class AcceptArray extends Array
{
	/**
	 * Construct a accept array
	 * 
	 * @param acceptString  (string)  Request header Accept
	 */
	constructor( acceptString, )
	{
		super();
		
		acceptString.split( ',', ).forEach( item=> {
			let [ mime, quality=1, ]= item.split( ';q=', );
			
			quality= Math.max( 0, Math.min( 1, +quality, ), );
			
			this.push( new AcceptItem( mime, quality, ), );
		}, );
		
		if( !this.length )
			this.push( new AcceptItem(), );
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
	 * Construct a accept item
	 * 
	 * @param ?mime    (string)
	 * @param ?quality (number)
	 */
	constructor( mime='*/*', quality=1, )
	{
		this.mime= mime;
		[ this.type, this.subtype=null, ]= mime.split( '/', );
		
		if( !this.subtype )
			throw new Error( `MIME type ${mime} is invalid`, );
	}
	
	/**
	 * Convert accept item to HTTP Request header string.
	 * 
	 * @return (string)
	 */
	toString()
	{
		if( this.quality===1 )
			return this.mime;
		else
			return `${this.mime};q=${this.quality}`;
	}
}
