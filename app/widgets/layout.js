import { ele, txt, wid, nav, } from '/web/butterfly/src/butterfly.js';
import * as main_grid from './main-grid.js';

export function main()
{
	
}

export default [
	ele( 'html', {}, {}, [
		ele( 'head', {}, {}, [
			ele( 'meta', { charset:'utf-8', }, {}, ),
			ele( 'title', {}, {}, [
				txt( 'iGit', ),
			], ),
			ele( 'link', { href:'/app/css/layout.css', type:'text/css', rel:'stylesheet', }, {}, ),
			ele( 'link', { href:'/app/css/style.css', type:'text/css', rel:'stylesheet', }, {}, ),
		], ),
		ele( 'body', {}, {}, [
			wid( main_grid, ),
		], ),
	], ),
];
