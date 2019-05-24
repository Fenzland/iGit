
export default class Graph
{
	
	/**
	 * Row data of commits
	 * 
	 * @type []{ row:(number), commit:{Commit}, }
	 * 
	 * @type-ref {Commit} {
	 *      hash:          (string),
	 *      shortHash:     (string),
	 *      treeHash:      (string),
	 *      shortTreeHash: (string),
	 *      parents:       [](string),
	 *      auther:        {Actor},
	 *      committer:     {Actor},
	 *      notes:         (string),
	 *      mark:          (string),
	 *      title:         (string),
	 *      body:          (string),
	 *  }
	 *  
	 *  @type-ref {Actor} {
	 *       name:      (string),
	 *       email:     (string),
	 *       time:      (string),
	 *       timestamp: (number),
	 *   }
	 */
	#data= [];
	
	/**
	 * The map from commit hash to commit.
	 * 
	 * @type { (string):{ row:(number), commit:{Commit}, }, }
	 */
	#map= {};
	
	/**
	 * The Graph body
	 * 
	 * @type []{ commit:{Commit}, row:(number), column:(number), width:(number), parents:[]{ dy:(number), hash:(string), }, children:[]{ commit:{Commit}, dx:(number), dy:(number), }, }
	 */
	#graph= [];
	
	/**
	 * The threads that waiting for the commit not loaded
	 * 
	 * @type []{ commit:{Commit}, row:(number), column:(number), parent:(string), lineal:(boolean), }
	 */
	#threads= [];
	
	/**
	 * Wheather the end of graph is loaded
	 * 
	 * @type (boolean)
	 */
	#isEnded= false;
	
	/**
	 * Construct a git log graph
	 * 
	 * @param commits []{Commit}
	 */
	constructor( commits, )
	{
		this.concat( commits, );
	}
	
	/**
	 * Concat more commits into this Graph
	 * 
	 * @param commits []{Commit}
	 */
	concat( commits, )
	{
		commits.forEach( line=> this.append( line, ), );
	}
	
	/**
	 * Append a commit into this Graph
	 * 
	 * @param commit {Commit}
	 */
	append( commit, )
	{
		const row= this.#storeCommitAndGetRowIndex( commit, );
		
		const children= this.#findChildrenFromThreads( row, commit.hash, );
		
		const preWidth= this.#threads.length;
		
		const column= this.#findColumn( children, );
		
		this.#threads.splice( column, 1, { commit, row, column, parent:commit.parents[0], lineal:true, }, );
		
		children.forEach( child=> {
			if( child.x !== column )
				this.#threads.splice( child.x, 1, undefined, );
		}, );
		
		commit.parents.slice( 1, ).forEach( parent=> {
			const space= this.#findTheadSpace();
			
			this.#threads.splice( space, 1, { commit, row, column, parent, lineal:false, }, );
		}, );
		
		children.forEach( child=> {
			const childLine= this.#graph[this.#map[child.commit.hash].row];
			
			child.x-= column;
			child.dx-= column;
			
			childLine.parents.find( parent=> parent.hash === commit.hash, ).dy= -child.dy;
		}, );
		
		const postWidth= this.#threads.length;
		
		this.#graph.push( {
			commit,
			row,
			column,
			width: Math.max( preWidth, postWidth, ),
			parents: commit.parents.map( hash=> ({ dy:0, hash, }), ),
			children,
		}, );
		
		if( !commit.parents.length )
		{
			this.#isEnded= true;
			this.#threads.splice( 0, );
		}
	}
	
	/**
	 * Store commit into private members, and return the row index
	 * 
	 * @param commit {Commit}
	 * 
	 * @return (number)
	 */
	#storeCommitAndGetRowIndex= ( commit, )=> {
		const row= this.#data.length;
		const stored= { row, ...commit, };
		
		this.#data.push( stored, );
		this.#map[commit.hash]= stored;
		
		return row;
	};
	
	/**
	 * Find children from threads by commit hash
	 * 
	 * @param row  (number)
	 * @param hash (string)
	 * 
	 * @return []{ dy:(number), dx:(number), commit:{Commit}, lineal:(boolean), }
	 */
	#findChildrenFromThreads= ( row, hash, )=> {
		return this.#threads.reduce( ( children, thread, x, )=> {
			if( thread && thread.parent === hash )
				children.push( { dy:thread.row - row, dx:thread.column, x, commit:thread.commit, lineal:thread.lineal, }, );
			
			return children;
		}, [], );
	};
	
	/**
	 * Find the column the commit should take
	 * 
	 * @param children []{ dy:(number), dx:(number), commit:{Commit}, lineal:(boolean), }
	 * 
	 * @return (number)
	 */
	#findColumn= ( children, )=> {
		if(!( children.length ))
			return this.#findTheadSpace();
		
		const child= children.find( child=> child.lineal, )|| children[0];
		
		return child? child.x: this.#findTheadSpace();
	}
	
	/**
	 * Find the empty space that next commit can take
	 * 
	 * @return (number)
	 */
	#findTheadSpace= ()=> {
		return this.#threads.concat( undefined, ).findIndex( thread=> thread === undefined, );
	};
	
	/**
	 * Get commit by hash
	 * 
	 * @return { row:(number), commit:{Commit}, }
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
	 * Get wheather the end of graph is loaded
	 * 
	 * @return (boolean)
	 */
	get isEnded()
	{
		return this.#isEnded;
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
