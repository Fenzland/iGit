import { deepAssign, } from '../app/modules.js';

export default class Diff
{
	/**
	 * Diff type, always be 'git'
	 * 
	 * @type (string)
	 */
	#diffType= 'git';
	
	/**
	 * Change actions
	 * 
	 * @type {Set}
	 */
	#actions= new Set();
	
	/**
	 * Hunks
	 * 
	 * @type []{ left:@Hunk, right:@Hunk, }
	 * 
	 * @type-ref {Hunk} {
	 *      start: (number),
	 *      end:   (number),
	 *      pieces: []{
	 *          start: (number),
	 *          end:   (number),
	 *          added: (boolean),
	 *          deleted: (boolean),
	 *          lines:    []{
	 *              num:     (number),
	 *              content: (string),
	 *          },
	 *      },
	 *  }
	 */
	#hunks= [];
	
	/**
	 * Left side
	 * 
	 * @type {
	 *      file:      (string),
	 *      mode:      (string),
	 *      lineCount: (number),
	 *      hunks: []{@Hunk},
	 *  }
	 */
	#left=  { hunks:[], file:undefined, mode:undefined, lineCount:0, };
	
	/**
	 * Right side
	 * 
	 * @type {
	 *      file:      (string),
	 *      mode:      (string),
	 *      lineCount: (number),
	 *      hunks: []{@Hunk},
	 *  }
	 */
	#right= { hunks:[], file:undefined, mode:undefined, lineCount:0, };
	
	/**
	 * Construct a file diff
	 * 
	 * @param ?diffDoc (string)
	 */
	constructor( diffDoc=undefined, )
	{
		if( diffDoc )
		{
			const [ header, ...hunks ]= diffDoc.split( /(?=\n@@ [^@]* @@\n?)/, );
			
			this.#parseHeader( header, );
			
			if( hunks.length )
				this.#actions.add( 'MODIFY', );
			
			hunks.forEach( hunk=> this.#parseHunk( hunk, ), );
		}
	}
	
	/**
	 * Get a reversed diff.
	 * 
	 * @return {Diff}
	 */
	reverse()
	{
		const diff= new Diff();
		
		diff.#diffType= this.#diffType;
		this.#actions.forEach( value=> diff.#actions.add( value, ), );
		this.#hunks.forEach( hunk=> diff.#hunks.push( { left:deepAssign( {}, hunk.right, ), right:deepAssign( {}, hunk.left, ), }, ), );
		diff.#left=  deepAssign( {}, this.#right, );
		diff.#right= deepAssign( {}, this.#left, );
		
		return diff;
	}
	
	/**
	 * Pick lines and create a new diff.
	 * 
	 * @params ...[ start, end, ]   [][ (number), (number), ]
	 * 
	 * @return {Diff}
	 */
	pickLines( ...ranges )
	{
		const diff= new Diff();
		
		diff.#diffType= this.#diffType;
		this.#actions.forEach( value=> diff.#actions.add( value, ), );
		
		ranges.sort().forEach( ( [ start, end, ], )=> {
			const hunk= binarySearch( this.#hunks, hunk=> (
				start < hunk.left.start? -1:
				end < hunk.left.end? 1:
				0
			), );
			
			if( !hunk )
				throw new Error( `range [${start},${end}] is invalid`, );
			
			const left=  { lines: [], start: hunk.left.start,  end: hunk.left.end,  };
			const right= { lines: [], start: hunk.right.start, end: hunk.right.end, };
			
			// FIXME
			for(
				let lI= 0, rI= 0;
				lI < hunk.left.lines.length || rI < hunk.right.lines.length;
			){
				const lLine=  hunk.left.lines[lI];
				const rLine= hunk.right.lines[rI];
				
				if( lLine.num < start || lLine.num > end )
				{
					piece%2 && ++piece;
					
					left.lines.push(  { num: lLine.num, content: lLine.content, }, );
					right.lines.push( { num: lLine.num, content: lLine.content, }, );
					
					++diff.#left.lineCount;
					++diff.#right.lineCount;
					
					++lI, --rI;
				}
				else
				if( lLine && lLine.modified )
				{
					piece%2 || ++piece;
					
					left.lines.push( { num: lLine.num, content: lLine.content, }, );
					
					++diff.#left.lineCount;
					
					++lI;
				}
				else
				if( rLine && rLine.modified )
				{
					piece%2 || ++piece;
					
					right.lines.push( { num: rLine.num, content: rLine.content, }, );
					
					++diff.#right.lineCount;
					
					++rI;
				}
				else
				{
					piece%2 && ++piece;
					
					left.lines.push(  { num: lLine.num, content: lLine.content, }, );
					right.lines.push( { num: lLine.num, content: lLine.content, }, );
					
					++diff.#left.lineCount;
					++diff.#right.lineCount;
					
					++lI, ++rI;
				}
			}
			
			diff.#hunks.push( { left, right, }, );
			diff.#left.hunks.push( left, );
			diff.#right.hunks.push( right, );
		}, );
		
		return diff;
	}
	
	/**
	 * Get diff type, always be 'git'
	 * 
	 * @return (string)
	 */
	get diffType()
	{
		return this.#diffType;
	}
	
	/**
	 * Get copy of hunks
	 * 
	 * @return []
	 */
	get hunks()
	{
		return deepAssign( [], this.#hunks, );
	}
	
	/**
	 * Get copy of left side
	 * 
	 * @return {}
	 */
	get left()
	{
		return deepAssign( {}, this.#left, );
	}
	
	/**
	 * Get copy of right side
	 * 
	 * @return {}
	 */
	get right()
	{
		return deepAssign( {}, this.#right, );
	}
	
	/**
	 * Get hunk count
	 * 
	 * @return (number)
	 */
	get hunkCount()
	{
		return this.#hunks.length;
	}
	
	/**
	 * Get file name of left side
	 * 
	 * @return (string)
	 */
	get leftFile()
	{
		return this.#left.file;
	}
	
	/**
	 * Get file name of right side
	 * 
	 * @return (string)
	 */
	get rightFile()
	{
		return this.#right.file;
	}
	
	/**
	 * Get mode of left side
	 * 
	 * @return (string)
	 */
	get leftMode()
	{
		return this.#left.mode;
	}
	
	/**
	 * Get mode of right side
	 * 
	 * @return (string)
	 */
	get rightMode()
	{
		return this.#right.mode;
	}
	
	/**
	 * Get line count of left side
	 * 
	 * @return (number)
	 */
	get leftLineCount()
	{
		return this.#left.lineCount;
	}
	
	/**
	 * Get line count of right side
	 * 
	 * @return (number)
	 */
	get rightLineCount()
	{
		return this.#right.lineCount;
	}
	
	/**
	 * For JSON.stringify
	 * 
	 * @return (string)
	 */
	toJSON()
	{
		return this.toString();
	}
	
	/**
	 * Render a diff to string
	 * 
	 * @return (string)
	 */
	toString()
	{
		const lines= [];
		
		lines.push( `diff --${this.#diffType} a/${this.#left.file} b/${this.#right.file}\n`, );
		
		if( this.#actions.has( 'RENAME', ) )
		{
			lines.push( `rename from ${this.#left.file}\n`, );
			lines.push( `rename to ${this.#right.file}\n`, );
		}
		if( this.#actions.has( 'CHMOD', ) )
		{
			lines.push( `old mode ${this.#left.mode}\n`, );
			lines.push( `new mode ${this.#right.mode}\n`, );
		}
		if( this.#actions.has( 'CREATE', ) )
		{
			lines.push( `new file mode ${this.#right.mode}\n`, );
		}
		if( this.#actions.has( 'DELETE', ) )
		{
			lines.push( `deleted file mode ${this.#left.mode}\n`, );
		}
		if( this.#actions.has( 'MODIFY', ) )
		{
			lines.push( `--- a/${  this.#left.file }\n`, );
			lines.push( `+++ b/${ this.#right.file }\n`, );
			
			this.#hunks.forEach( ( { left, right, }, )=> {
				
				lines.push( `@@ -${right.start},${right.end - 1 - right.start} +${left.start},${left.end - 1 - left.start} @@\n`, );
				
				for(
					let index= 0;
					index < left.pieces.length;
					++index
				){
					const lStop=  left.pieces[index];
					const rStop= right.pieces[index];
					
					if( lStop.added )
					{
						for( let line of rStop.lines )
							lines.push( `-${line.content}`, );
						for( let line of lStop.lines )
							lines.push( `+${line.content}`, );
					}
					else
						for( let line of lStop.lines )
							lines.push( ` ${line.content}`, );
				}
				
				lines.push( '\n', );
			}, );
		}
		
		return lines.join( '', );
	}
	
	/**
	 * Parse hunk string
	 * 
	 * @context {Diff}
	 * 
	 * @param hunk (string)
	 * 
	 * @return <void>
	 */
	#parseHunk= hunk=> {
		const [ numLine, scope, ...lines ]= hunk.trim().replace( /(?<=^@@ [^@]+ @@)/, '\n', ).split( /(?<=\n)/, );
		
		let [ rN, lN, ]= numLine.match( /(?<=-)\d+|(?<=\+)\d+/g, ).map( x=> +x, );
		let piece= 0;
		
		const left=  { start:lN, end:lN, pieces:[ { start:lN, end:lN, added:false, deleted:false, lines:[], }, ], };
		const right= { start:rN, end:rN, pieces:[ { start:rN, end:rN, added:false, deleted:false, lines:[], }, ], };
		
		lines.forEach( line=> {
			const [ sign, content='', ]= line.split( /(?<=^.)/, );
			
			switch( sign )
			{
				case ' ':
					if( piece%2 )
					{
						++piece;
						left.pieces.push( {  start:lN, end:lN, added:false, deleted:false, lines:[], }, );
						right.pieces.push( { start:rN, end:rN, added:false, deleted:false, lines:[], }, );
						
					}
					
					left.pieces[piece].lines.push( { num: lN, content, }, );
					left.pieces[piece].end= lN - - 1;
					right.pieces[piece].lines.push( { num: rN, content, }, );
					right.pieces[piece].end= rN - - 1;
					
					++this.#left.lineCount;
					++this.#right.lineCount;
					
					++lN, ++rN;
				break;
				
				case '-':
					if(!( piece%2 )){
						++piece;
						left.pieces.push( {  start:lN, end:lN, added:true,  deleted:false, lines:[], }, );
						right.pieces.push( { start:rN, end:rN, added:false, deleted:true,  lines:[], }, );
					}
					
					right.pieces[piece].lines.push( { num: rN, content, }, );
					right.pieces[piece].end= rN - - 1;
					
					++this.#right.lineCount;
					
					++rN;
				break;
				
				case '+':
					if(!( piece%2 )){
						++piece;
						left.pieces.push(  { start:lN, end:lN, added:true,  deleted:false, lines:[], }, );
						right.pieces.push( { start:rN, end:rN, added:false, deleted:true,  lines:[], }, );
					}
					
					left.pieces[piece].lines.push( { num: lN, content, }, );
					left.pieces[piece].end= lN - - 1;
					
					++this.#left.lineCount;
					
					++lN;
				break;
			}
		}, );
		
		left.end= lN;
		right.end= rN;
		
		this.#left.hunks.push( left, );
		this.#right.hunks.push( right, );
		this.#hunks.push( { left, right, }, );
	};
	
	/**
	 * Parse diff header
	 * 
	 * @context {Diff}
	 * 
	 * @param header (string)
	 * 
	 * @return <void>
	 */
	#parseHeader= header=> {
		header.trim().split( '\n', ).forEach( line=> {
			const [ type, ...args ]= line.split( ' ', );
			const parser= this.#headerParsers[type];
			
			if( parser )
				parser.call( this, ...args, );
		}, );
	};
	
	/**
	 * Header pasers
	 * 
	 * @type { (string):()=><void>, }
	 */
	#headerParsers= {
		/**
		 * Parse diff line
		 * 
		 * @param diffType  (string)
		 * @param leftFile  (string)
		 * @param rightFile (string)
		 * 
		 * @return <>
		 */
		diff( diffType, leftFile, rightFile, ){
			this.#diffType= diffType.replace( /^--/, '', );
			this.#left.file= leftFile.replace( /^a\//, '', );
			this.#right.file= rightFile.replace( /^b\//, '', );
			
			if( this.#left.file !== this.#right.file )
				this.#actions.add( 'RENAME', );
		},
		
		/**
		 * Parse old model
		 * 
		 * @param ...args [](string)
		 * 
		 * @return <>
		 */
		old( ...args ){
			
			if( args[0] === 'mode' )
			{
				this.#actions.add( 'CHMOD', );
				this.#left.mode= args[1];
			}
		},
		
		/**
		 * Parse new model
		 * 
		 * @param ...args [](string)
		 * 
		 * @return <>
		 */
		new( ...args ){
			if( args[0] === 'mode' )
			{
				this.#actions.add( 'CHMOD', );
				this.#right.mode= args[1];
			}
			else
			if( args[0] === 'file' && args[1] === 'mode' )
			{
				this.#actions.add( 'CREATE', );
				this.#right.mode= args[2];
			}
		},
		
		/**
		 * Parse delete model
		 * 
		 * @param ...args [](string)
		 * 
		 * @return <>
		 */
		deleted( ...args ){
			if( args[0] === 'file' && args[1] === 'mode' )
			{
				this.#actions.add( 'DELETE', );
				this.#left.mode= args[2];
			}
		},
	};
}

/**
 * find item in a sorted array with binary search.
 * 
 * @param sortedArray []<any#item>
 * @param compare     <any#item>=>|-1|0|1|
 * 
 * @return ?<any#item>
 */
function binarySearch( sortedArray, compare, )
{
	const index= binarySearchIndex( sortedArray, compare, );
	
	if( index >= 0 )
		return sortedArray[index];
	else
		return undefined;
}

/**
 * find index in a sorted array with binary search.
 * 
 * @param sortedArray []<any#item>
 * @param compare     <any#item>=>(number)
 * 
 * @return (number)
 */
function binarySearchIndex( sortedArray, compare, )
{
	let start= 0;
	let end= sortedArray.length - 1;
	let middle;
	
	while( middle= (start - - end)/2|0 )
	{
		result= compare( sortedArray[middle], );
		
		if( result === 0 )
			return middle;
		else
		if( result > 0 )
			end= middle - 1;
		else
		if( result < 0 )
			start= middle - - 1;
		else
			throw new Error( 'compare function must returns number', )
		
		if( start > end )
			return -1;
	}
}
