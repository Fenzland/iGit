
export default class Graph
{
	
	/**
	 * @type []{Commit}
	 */
	#data= [];
	
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
	 * 
	 * @type []
	 */
	#threads= [];
	
	/**
	 * Construct a git log graph
	 * 
	 * @param data []{Commit}
	 */
	constructor( data, )
	{
		this.append( data, );
	}
	
	append( data, )
	{
		this.#data= data.map( ( line, index, )=> ({ index, ...line, }), );
		
		for( let n= this.#data.length - 1, commit= this.#data[n];  n >= 0;  commit= this.#data[--n] )
		{
			this.#parentMap[commit.hash]= commit.parents.map( hash=> this.#map[hash], );
			
			this.#map[commit.hash]= commit;
		}
		
		for( let [ row, commit, ] of this.#data.entries() )
		{
			const children= [];
			
			for( let [ x, thread, ] of this.#threads.entries() )
			{
				if( thread.parent === commit.hash )
					children.push( { dy: thread.row - row, dx: thread.column, x, commit: thread.commit, }, );
			}
			
			let column;
			
			if( children.length )
			{
				column= children[0].x;
				
				this.#threads.splice( column, 1, { commit, row, column, parent: commit.parents[0], }, );
				
				children.slice( 1, ).forEach( ( child, x, )=> this.#threads.splice( child.x - - x, 1, ), );
			}
			else
			{
				column= this.#threads.length;
				
				this.#threads.push( { commit, row, column, parent: commit.parents[0], }, );
			}
			
			commit.parents.slice( 1, ).forEach( parent=> this.#threads.push( { commit, row, column, parent, }, ), );
			
			children.forEach( child=> {
				child.x-= column;
				child.dx-= column;
				
				const childLine= this.#graph[this.#map[child.commit.hash].index];
				childLine.parents.find( parent=> parent.commit === commit, ).dy= -child.dy;
			}, );
			
			this.#graph.push( { commit, row, column, width: this.#threads.length, parents: commit.parents.map( hash=> ({ dy:0, commit:this.#map[hash], }), ), children, }, );
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
	 * Get threads object.
	 * 
	 * @return []{}
	 */
	get threads()
	{
		return this.#threads;
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
