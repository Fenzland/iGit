
export default class Refs
{
	/**
	 * Refs
	 * 
	 * @type []{@Ref}
	 */
	#refs;
	
	/**
	 * Refs tree
	 * 
	 * @type {@Tree}
	 * 
	 * @type-ref {Tree} { name:(string), type:|'ref'|, children:{ (string):<{@Tree}|{@Ref}>, }, }
	 * @type-ref {Ref}  { name:(string), type:|'ref'|, ref:{ name:(string), shortName:(string), hash:(string), shortHash:(string), symref:(string), }, }
	 */
	#tree;
	
	/**
	 * Map from names to refs
	 * 
	 * @type { (string):{@Ref}, }
	 */
	#map= {};
	
	/**
	 * Construct the refs tree
	 * 
	 * @param refs []{@Ref}
	 */
	constructor( refs, )
	{
		this.#refs= refs;
		
		const rootTree= genTree();
		
		for( let ref of refs )
		{
			const path= ref.name.split( '/', );
			const lastName= path.pop();
			
			const tree= path.reduce( ( tree, name, )=> (
				tree.children.hasOwnProperty( name, )? 
				tree.children[name]: 
				(tree.children[name]= genTree( name, ))
			), rootTree, );
			
			tree.children[lastName]= { name: lastName, type: 'ref', ref, };
			
			this.#map[ref.name]= ref;
		}
		
		this.#tree= genTree( '', {
			HEAD: rootTree.children.HEAD,
			...rootTree.children.refs.children,
		}, );
	}
	
	/**
	 * Get ref by name
	 * 
	 * @return {@Ref}
	 */
	getRef( name, )
	{
		return this.#map[name];
	}
	
	/**
	 * Get ref by name
	 * 
	 * @return {@Tree}
	 */
	get tree()
	{
		return this.#tree;
	}
	
	/**
	 * Get ref by name
	 * 
	 * @return []{@Ref}
	 */
	get refs()
	{
		return this.#refs;
	}
	
	/**
	 * Iterator of refs
	 * 
	 * @return {Iterator}
	 */
	[Symbol.iterator]()
	{
		return this.#refs.values();
	}
}

/**
 * Generate a tree node
 * 
 * @param name     (string)
 * @param children { (string):<{@Tree}|{@Ref}>, }
 * 
 * @return {@Tree}
 */
function genTree( name='', children={}, )
{
	return {
		name,
		type: 'tree',
		children,
	};
}
