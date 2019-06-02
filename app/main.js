import '../init.js';
import { Vue, } from './modules.web.js';

Vue.prototype.z= z;

const app= new Vue( {
	el: 'body>main',
	
	template: /*HTML*/`
		<main>
			<header>
				<h1> <img class="logo" src="/logo.svg">iGit </h1>
				<span class="version"> v0.2.0 </span>
			</header>
		</main>
	`,
	
	data: {
	},
}, );
