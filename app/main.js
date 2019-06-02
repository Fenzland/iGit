import '../init.js';
import { Vue, } from './modules.web.js';
import Eve from './Eve.js';

Vue.prototype.z= z;
Vue.use( Eve, );

Vue.prototype.formatTime= time=> new Date( time, ).toLocaleString(
	navigator.language,
	{ year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long', hour: '2-digit', hour12: false, minute: '2-digit', },
)

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
