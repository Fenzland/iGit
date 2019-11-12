import Git from '../../git/Git.js';
import { BASE_DIR, } from '../env.js';

(async()=> {
	
	const git= await new Git( `${BASE_DIR}/.git`, BASE_DIR, );
	
	const $index= git.getIndex();
	console.assert( $index instanceof Promise, '{Git}.getIndex() must returns a promise.', );
	
	const index= await $index;
	console.assert( index instanceof Array, 'await {Git}.getIndex() must returns an array.', );
	
	// git.cli.applyIndex( 'diff --git a/test-b b/test-b\nnew file mode 100644\n@@ -0,0 +1,1 @@\n+user\n', )
	// git.cli.applyIndex( 'diff --git a/test-b b/test-b\ndeleted file mode 100644\n@@ -1,1 +0,0 @@\n-user\n', )
})();
