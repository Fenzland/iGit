import '../init.js';
import { Vue, } from './modules.web.js';

Vue.prototype.z= z;

const app= new Vue( {
	el: 'body>main',
	
	template: /*HTML*/`
		<main>
			<header>
				<h1> iGit </h1>
			</header>
		</main>
	`,
}, );
