
export default class Graph
{
	
	/**
	 * @type []{Commit}
	 */
	#data;
	
	/**
	 * @type { (string):Commit, }
	 */
	#map= {};
	
	/**
	 * @type { (string):Commit, }
	 */
	#parentMap= {};
	
	/**
	 * @type []{ commit:{Commit}, row:(number), column:(number), width:(number), parents:[]{Commit}, children:[]{ commit:{Commit}, dx:(number), dy:(number), index:(number), }, }
	 */
	#graph= [];
	
	/**
	 * Construct a git log graph
	 * 
	 * @param data []{Commit}
	 */
	constructor( data, )
	{
		this.#data= data.map( ( line, index, )=> ({ index, ...line, }), );
		
		for( let n= this.#data.length - 1, commit= this.#data[n];  n >= 0;  commit= this.#data[--n] )
		{
			this.#parentMap[commit.hash]= commit.parents.map( hash=> this.#map[hash], );
			
			this.#map[commit.hash]= commit;
		}
		
		const threads= [];
		
		for( let [ row, commit, ] of this.#data.entries() )
		{
			const children= [];
			
			for( let [ x, thread, ] of threads.entries() )
			{
				if( thread.parent === commit.hash )
					children.push( { dy: thread.row - row, dx: thread.column, x, commit: thread.commit, }, );
			}
			
			let column;
			
			if( children.length )
			{
				column= children[0].x;
				
				threads.splice( column, 1, { commit, row, column, parent: commit.parents[0], }, );
				
				children.slice( 1, ).forEach( ( child, x, )=> threads.splice( child.x - - x, 1, ), );
			}
			else
			{
				column= threads.length;
				
				threads.push( { commit, row, column, parent: commit.parents[0], }, );
			}
			
			commit.parents.slice( 1, ).forEach( parent=> threads.push( { commit, row, column, parent, }, ), );
			
			children.forEach( child=> {
				child.x-= column;
				child.dx-= column;
				
				const childLine= this.#graph[this.#map[child.commit.hash].index];
				childLine.parents.find( parent=> parent.commit === commit, ).dy= -child.dy;
			}, );
			
			this.#graph.push( { commit, row, column, width: threads.length, parents: commit.parents.map( hash=> ({ dy:0, commit:this.#map[hash], }), ), children, }, );
		}
	}
	
	/**
	 * Get commit by hash
	 * 
	 * @return {}
	 */
	getCommit( hash, )
	{
		return this.#map[hash];
	}
	
	/**
	 * Get graph object.
	 * 
	 * @return []{}
	 */
	get graph()
	{
		return this.#graph;
	}
	
	/**
	 * For JSON.stringify
	 * 
	 * @return {}[]
	 */
	toJSON()
	{
		return this.#data;
	}
}
