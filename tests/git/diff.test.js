import Git from '../../git/Git.js';
import Patch from '../../git/Patch.js';
import { BASE_DIR, } from '../env.js';

(async()=> {
	
	const git= await new Git( `${BASE_DIR}/.git`, BASE_DIR, );
	
	git.cli.applyIndex( z((await git.cli.diff())[0].toString()), );
})();
