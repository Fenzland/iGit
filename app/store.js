import { Vue, Vuex, } from './modules.web.js';

Vue.use( Vuex, );

export default new Vuex.Store( {
	state: {
		mode: 'root',
	},
}, );
