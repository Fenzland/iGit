import { deepAssign, multipleReduce, modulo, } from '../app/modules.js';

export default class TripleDiff
{
	/**
	 * Diff type, always be 'git'
	 * 
	 * @type (string)
	 */
	#diffType= 'git';
	
	/**
	 * Change actions of left diff
	 * 
	 * @type {Set}
	 */
	#leftActions= new Set();
	
	/**
	 * Change actions of right diff
	 * 
	 * @type {Set}
	 */
	#rightActions= new Set();
	
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
	#left=   { hunks:[], file:undefined, mode:undefined, lineCount:0, };
	
	/**
	 * Middle side
	 * 
	 * @type {
	 *      file:      (string),
	 *      mode:      (string),
	 *      lineCount: (number),
	 *      hunks: []{@Hunk},
	 *  }
	 */
	#middle= { hunks:[], file:undefined, mode:undefined, lineCount:0, };
	
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
	#right=  { hunks:[], file:undefined, mode:undefined, lineCount:0, };
	
	/**
	 * Consturct a triple-diff
	 * 
	 * @param leftDiff  {Diff}
	 * @param rightDiff {Diff}
	 */
	constructor( leftDiff, rightDiff, turnBackDiff, )
	{
		this.#left.file=    leftDiff.leftFile || rightDiff.leftFile;
		this.#middle.file= leftDiff.rightFile || rightDiff.leftFile;
		this.#right.file= rightDiff.rightFile || leftDiff.rightFile;
		this.#left.mode=    leftDiff.leftMode || rightDiff.leftMode;
		this.#middle.mode= leftDiff.rightMode || rightDiff.leftMode;
		this.#right.mode= rightDiff.rightMode || leftDiff.rightMode;
		
		const clearHunk= hunk=> ({
			start: hunk.start,
			end: hunk.end,
			pieces: hunk.pieces.map( piece=> ({
				start: piece.start,
				end: piece.end,
				added: false,
				deleted: false,
				lines: piece.lines.map( line=> ({ ...line, }), ),
			}), ),
		});
		
		multipleReduce(
			{
				compare: ( x, y, xN, yN, )=> ({
					0: ()=> x.left.start  <= y.left.start,
					1: ()=> x.right.start <= y.left.start,
					2: ()=> x.left.start  <= y.right.start,
				}[modulo( yN - xN, 3, )])(),
				proceed: ( courier, item, n, i, )=> {
					switch( n )
					{
						case 0:
						{
							if( courier.leftNum < item.left.start )
							{
								courier.left= deepAssign( {}, item.left, );
								this.#left.hunks.push( courier.left, );
								this.#left.lineCount-=- (item.left.end - item.left.start);
							}
							else
								Object.assign( courier.left, mergeHunk( courier.left, item.left, ), );
							
							if( courier.middleNum < item.right.start )
							{
								courier.middle= deepAssign( {}, item.right, );
								this.#middle.hunks.push( courier.middle, );
								this.#middle.lineCount-=- (item.right.end - item.right.start);
							}
							else
								Object.assign( courier.middle, mergeHunk( courier.middle, item.right, ), );
						}
						break;
						
						case 1:
						{
							if( courier.rightNum < item.right.start )
							{
								courier.right= deepAssign( {}, item.right, );
								this.#right.hunks.push( courier.right, );
								this.#right.lineCount-=- (item.right.end - item.right.start);
							}
							else
								Object.assign( courier.right, mergeHunk( courier.right, item.right, ), );
							
							if( courier.middleNum < item.left.start )
							{
								courier.middle= deepAssign( {}, item.left, );
								this.#middle.hunks.push( courier.middle, );
								this.#middle.lineCount-=- (item.left.end - item.left.start);
							}
							else
								Object.assign( courier.middle, mergeHunk( courier.middle, item.left, ), );
						}
						break;
						
						case 2:
						{
							if( courier.rightNum < item.left.start )
							{
								courier.right= clearHunk( item.left, );
								this.#right.hunks.push( courier.right, );
								this.#right.lineCount-=- (item.left.end - item.left.start);
							}
							else
								Object.assign( courier.right, mergeHunk( courier.right, clearHunk( item.left, ), ), );
							
							if( courier.leftNum < item.right.start )
							{
								courier.left= clearHunk( item.right, );
								this.#left.hunks.push( courier.left, );
								this.#left.lineCount-=- (item.right.end - item.right.start);
							}
							else
								Object.assign( courier.left, mergeHunk( courier.left, clearHunk( item.right, ), ), );
						}
						break;
					}
					
					courier.leftNum=   courier.left?   courier.left.end:   -1;
					courier.middleNum= courier.middle? courier.middle.end: -1;
					courier.rightNum=  courier.right?  courier.right.end:  -1;
					
					return courier;
				},
				init: { leftNum:-1, middleNum:-1, rightNum:-1, left:undefined, middle:undefined, right:undefined, },
			},
			leftDiff.hunks,
			rightDiff.hunks,
			turnBackDiff.hunks,
		)
		
		function mergeHunk( x, y, )
		{
			const start= Math.min( x.start, y.start, );
			const end=   Math.max( x.end,   y.end,   );
			
			const pieces= [];
			
			multipleReduce(
				{
					compare: ( x, y, )=> x.start - - x.end < y.start - - y.end,
					proceed: ( courier, item, n, i, )=> {
						if( !courier.piece || (courier.piece.end <= item.start && courier.piece.start < item.end) )
						{
							courier.piece= deepAssign( {}, item, );
							pieces.push( courier.piece, );
						}
						else
						{
							const origin= Object.assign( {}, courier.piece, );
							
							if( item.start < origin.start )
								pieces.splice( -1, 0, {
									start: item.start,
									end: origin.start,
									added: item.added,
									deleted: item.deleted,
									lines: item.lines.slice( 0, origin.start - item.start, ).map( line=> ({ ...line, }), ),
								}, );
							else
							if( origin.start < item.start )
							{
								pieces.splice( -1, 0, {
									start: origin.start,
									end: item.start,
									added: origin.added,
									deleted: origin.deleted,
									lines: courier.piece.lines.splice( 0, item.start - origin.start, ),
								}, );
								courier.piece.start= item.start;
							}
							
							courier.piece.added= origin.added || item.added;
							courier.piece.deleted= origin.deleted || item.deleted;
							
							if( origin.end < item.end )
							{
								courier.piece= {
									start: origin.end,
									end: item.end,
									added: item.added,
									deleted: item.deleted,
									lines: item.lines.slice( origin.end - item.end, ).map( line=> ({ ...line, }), ),
								}
								pieces.push( courier.piece, );
							}
							else
							if( item.end < origin.end )
							{
								courier.piece.end= item.end;
								courier.piece= {
									start: item.end,
									end: origin.end,
									added: origin.added,
									deleted: origin.deleted,
									lines: courier.piece.lines.splice( item.end - origin.end, ),
								}
								pieces.push( courier.piece, );
							}
						}
						
						return courier;
					},
					init: { piece:undefined, },
				},
				x.pieces,
				y.pieces,
			);
			
			// pieces.forEach( piece=> piece.lines.length || (piece.added= false), );
			
			return { start, end, pieces, };
		}
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
	 * Get copy of left side
	 * 
	 * @return {}
	 */
	get left()
	{
		return deepAssign( {}, this.#left, );
	}
	
	/**
	 * Get copy of middle side
	 * 
	 * @return {}
	 */
	get middle()
	{
		return deepAssign( {}, this.#middle, );
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
}
