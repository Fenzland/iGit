import Git from '../../git/Git.js';
import { BASE_DIR, } from '../env.js';

(async()=> {
	
	const git= await new Git( `${BASE_DIR}/.git`, BASE_DIR, );
	
	z(git.getHEAD());
})();
