import { rg, } from '../modules.web.js';

export default {
	props: {
		content: {
			type: String,
		},
		mime: {
			type: String,
			default: 'text/plain',
		},
	},
	
	render( _, ){
		const parser= parsers[this.mime] || parsers['text/plain'];
		const result= parser( this.content );
		
		return _(
			'span',
			{ class:[ 'high-light', this.mime.replace( '/', '--', ), ], },
			result.map( item=> _(
				'span',
				{
					class: [ 'high-light-item', item.type, ],
					...(
						!item.color? {}:
						{ style:{ 'background-color':item.color, }, }
					),
				},
				item.content,
			), ),
		);
	},
};

const whiteSpaces= {
	'\t': { type:'indent', render:'\t', },
	' ':  { type:'space',  render:' ',  },
	'\n': { type:'feed',   render:' ',  },
	'\r': { type:'return', render:' ',  },
};

const parsers= {
	'text/plain'( content, ){
		const regex= rg.or( rg.led( rg.whiteSpace, ), rg.followed( rg.whiteSpace, ), ).toRegExp();
		const pieces= content.split( regex, ).filter( _=> typeof _ === 'string', );
		
		return pieces.map( piece=> {
			if( piece in whiteSpaces )
				return { type:`white-space ${whiteSpaces[piece].type}`, content:whiteSpaces[piece].render, };
			else
				return { type:'text', content:piece, };
		}, );
	},
	'application/javascript'( content, ){
		()=> { return { [abc]: 'aoeu\'\'oeuo', }; };
		()=> /abc\/\\/;
		const regex= rg.or(
			rg.capture( rg.or(
				// strings
				rg.join( '`', rg.or( rg.notInSet( '`\\', ), '\\\\', '\\`', ).noneOrMore(), '`', ),
				rg.join( "'", rg.or( rg.notInSet( "'\\", ), "\\\\", "\\'", ).noneOrMore(), "'", ),
				rg.join( '"', rg.or( rg.notInSet( '"\\', ), '\\\\', '\\"', ).noneOrMore(), '"', ),
				
				// regex
				rg.join( '/', rg.or( rg.notInSet( '/\\', ), '\\\\', '\\/', ).oneOrMore(), '/', ),
				
				// comments
				rg.join( rg.or( ' ', '/', ), '*', rg.any.noneOrMore(), ).led( rg.indent, ),
				rg.join( '//', rg.any.noneOrMore(), ),
				rg.join( '/*', rg.or( rg.notInSet( '*', ), rg.make( '*', ).notFollowed( '/', ), ).noneOrMore(), '*/', ),
			), ),
			
			// white space or single symbol edges
			rg.led(      rg.or( rg.whiteSpace, rg.inSet( '()[]{}^*@#%:;,?', ), ), ),
			rg.followed( rg.or( rg.whiteSpace, rg.inSet( '()[]{}^*@#%:;,?', ), ), ),
			
			// multiple symbol edges
			rg.led( '+', ).notFollowed( '+', ), rg.followed( '+', ).notLed( '+', ), 
			rg.led( '-', ).notFollowed( '-', ), rg.followed( '-', ).notLed( '-', ), 
			rg.led( '&', ).notFollowed( '&', ), rg.followed( '&', ).notLed( '&', ), 
			rg.led( '|', ).notFollowed( '|', ), rg.followed( '|', ).notLed( '|', ), 
			rg.led( '.', ).notFollowed( '.', ), rg.followed( '.', ).notLed( '.', ), 
			
			rg.led( '>', ).notFollowed( rg.inSet( '>=', ), ), rg.followed( '>', ).notLed( rg.inSet( '>=', ), ), 
			rg.led( '<', ).notFollowed( rg.inSet( '<=', ), ), rg.followed( '<', ).notLed( '<', ), 
			rg.led( '=', ).notFollowed( rg.inSet( '=>', ), ), rg.followed( '=', ).notLed( rg.inSet( '<=>!', ), ), 
			rg.led( '!', ).notFollowed( '=', ),
		).toRegExp();
		
		const keywords= {
			do:'controller', while:'controller', for:'controller', 
			if:'controller', else:'controller', 
			switch:'controller', default:'controller', case:'controller', with:'controller', 
			try:'controller', catch:'controller', finally:'controller', 
			import:'module', export:'module', 
			return:'breaker', yield:'breaker', throw:'breaker', break:'breaker', continue:'breaker', 
			debugger:'debugger', 
			let:'declarer', var:'declarer', const:'declarer', class:'declarer', function:'declarer', 
			delete:'operator-like', of:'operator-like', as:'operator-like', from:'operator-like', 
			async:'operator', await:'operator', new:'operator', void:'operator', 
			in:'operator', instanceof:'operator', typeof:'operator', 
			false:'value', infinity:'value', NaN:'value', null:'value', true:'value', undefined:'value', 
		};
		
		const symbols= {
			'=':   'operator imba assign',
			':':   'operator imba key-value',
			'=>':  'operator imba func-arrow',
			'>':   'operator baln greater-then',
			'<':   'operator baln less-then',
			'==':  'operator baln like',
			'!=':  'operator baln not-like',
			'===': 'operator baln equal',
			'!==': 'operator baln not-equal',
			'+':   'operator baln plus',
			'-':   'operator baln minus',
			'*':   'operator baln star',
			'/':   'operator baln ratio',
			'%':   'operator baln mode',
			'&&':  'operator baln and',
			'||':  'operator baln or',
			'&':   'operator baln b-and',
			'|':   'operator baln b-or',
			'^':   'operator baln b-xor',
			'!':   'operator sngl not',
			'~':   'operator sngl b-not',
			'$':   'identifier dollar',
			'#':   'identifier private',
			'(':   'bracket parentheses',
			')':   'bracket parentheses',
			'[':   'bracket square-bracket',
			']':   'bracket square-bracket',
			'{':   'bracket brace',
			'}':   'bracket brace',
		};
		
		const pieces= content.split( regex, ).filter( _=> typeof _ === 'string', );
		
		return pieces.map( piece=> {
			if( piece in whiteSpaces )
				return { type:`white-space ${whiteSpaces[piece].type}`, content:whiteSpaces[piece].render, };
			else
			if( piece.match( /^[\/ ]\*|^\/\// ) )
				return { type:'comment', content:piece, };
			else
			if( piece.match( /^[`'"]/ ) )
				return { type:'string', content:piece, };
			else
			if( piece.match( /^\/(?:[^\/\\]|\\\\|\\\/)*\/$/ ) )
				return { type:'regex', content:piece, };
			else
			if( piece in keywords )
				return { type:`keyword ${keywords[piece]} ${piece}`, content:piece, };
			else
			if( piece in symbols )
				return { type:`symbol ${symbols[piece]}`, content:piece, };
			else
				return { type:'text', content:piece, };
		}, );
		
	},
	'text/css'( content, ){
		const colorRegexGen= rg.join( rg.or( 'hsl', 'rgb', ), rg.noneOrOne( 'a', ), '(', rg.notInSet( '()', ).oneOrMore(), ')', );
		const regex= rg.or(
			rg.capture( rg.or(
				// strings
				rg.join( "'", rg.or( rg.notInSet( "'\\", ), "\\\\", "\\'", ).noneOrMore(), "'", ),
				rg.join( '"', rg.or( rg.notInSet( '"\\', ), '\\\\', '\\"', ).noneOrMore(), '"', ),
				
				// comments
				rg.join( '/*', rg.or( rg.notInSet( '*', ), rg.make( '*', ).notFollowed( '/', ), ).noneOrMore(), '*/', ),
				
				// attr
				rg.join( rg.inSet( rg.word, '-', ).oneOrMore(), ':', ).followed( rg.whiteSpace, ),
				
				// at-rules
				rg.join( '@',  rg.inSet( rg.word, '-', ).oneOrMore(), ),
				
				// !important
				rg.join( '!',  rg.inSet( rg.word, '-', ).oneOrMore(), ),
				
				// selectors
				rg.join( '#',  rg.inSet( rg.word, '-', ).oneOrMore(), ),
				rg.join( '.',  rg.inSet( rg.word, '-', ).oneOrMore(), ),
				rg.join( '::', rg.inSet( rg.word, '-', ).oneOrMore(), ),
				rg.join( ':',  rg.inSet( rg.word, '-', ).oneOrMore(), ),
				
				// color
				colorRegexGen,
			), ),
			
			// white space or single symbol edges
			rg.led(      rg.or( rg.whiteSpace, rg.inSet( '()[]{}<>^@*#:;,.?!+-=&|$%', ), ), ),
			rg.followed( rg.or( rg.whiteSpace, rg.inSet( '()[]{}<>^@*#:;,.?!+-=&|$', ), ), ),
			
		).toRegExp();
		
		const colors= { aliceblue:1, antiquewhite:1, aqua:1, aquamarine:1, azure:1, beige:1, bisque:1, black:1, blanchedalmond:1, blue:1, blueviolet:1, brown:1, burlywood:1, cadetblue:1, chartreuse:1, chocolate:1, coral:1, cornflowerblue:1, cornsilk:1, crimson:1, cyan:1, darkblue:1, darkcyan:1, darkgoldenrod:1, darkgray:1, darkgreen:1, darkgrey:1, darkkhaki:1, darkmagenta:1, darkolivegreen:1, darkorange:1, darkorchid:1, darkred:1, darksalmon:1, darkseagreen:1, darkslateblue:1, darkslategray:1, darkslategrey:1, darkturquoise:1, darkviolet:1, deeppink:1, deepskyblue:1, dimgray:1, dimgrey:1, dodgerblue:1, firebrick:1, floralwhite:1, forestgreen:1, fuchsia:1, gainsboro:1, ghostwhite:1, gold:1, goldenrod:1, gray:1, green:1, greenyellow:1, grey:1, honeydew:1, hotpink:1, indianred:1, indigo:1, ivory:1, khaki:1, lavender:1, lavenderblush:1, lawngreen:1, lemonchiffon:1, lightblue:1, lightcoral:1, lightcyan:1, lightgoldenrodyellow:1, lightgray:1, lightgreen:1, lightgrey:1, lightpink:1, lightsalmon:1, lightseagreen:1, lightskyblue:1, lightslategray:1, lightslategrey:1, lightsteelblue:1, lightyellow:1, lime:1, limegreen:1, linen:1, magenta:1, maroon:1, mediumaquamarine:1, mediumblue:1, mediumorchid:1, mediumpurple:1, mediumseagreen:1, mediumslateblue:1, mediumspringgreen:1, mediumturquoise:1, mediumvioletred:1, midnightblue:1, mintcream:1, mistyrose:1, moccasin:1, navajowhite:1, navy:1, oldlace:1, olive:1, olivedrab:1, orange:1, orangered:1, orchid:1, palegoldenrod:1, palegreen:1, paleturquoise:1, palevioletred:1, papayawhip:1, peachpuff:1, peru:1, pink:1, plum:1, powderblue:1, purple:1, rebeccapurple:1, red:1, rosybrown:1, royalblue:1, saddlebrown:1, salmon:1, sandybrown:1, seagreen:1, seashell:1, sienna:1, silver:1, skyblue:1, slateblue:1, slategray:1, slategrey:1, snow:1, springgreen:1, steelblue:1, tan:1, teal:1, thistle:1, tomato:1, transparent:1, turquoise:1, violet:1, wheat:1, white:1, whitesmoke:1, yellow:1, yellowgreen:1, };
		
		const pieces= content.split( regex, ).filter( _=> typeof _ === 'string', );
		
		return pieces.map( piece=> {
			if( piece in whiteSpaces )
				return { type:`white-space ${whiteSpaces[piece].type}`, content:whiteSpaces[piece].render, };
			else
			if( piece.startsWith( '@', ) )
				return { type:'at-rule', content:piece, };
			else
			if( piece.startsWith( '!', ) )
				return { type:'important', content:piece, };
			else
			if( piece.startsWith( '#', ) )
				return { type:'selector id', content:piece, };
			else
			if( piece.startsWith( '.', ) )
				return { type:'selector class', content:piece, };
			else
			if( piece.startsWith( '::', ) )
				return { type:'selector pseudo-element', content:piece, };
			else
			if( piece.startsWith( ':', ) )
				return { type:'selector pseudo-class', content:piece, };
			else
			if( piece.startsWith( ':', ) )
				return { type:'selector pseudo-class', content:piece, };
			else
			if( piece.endsWith( ':', ) )
			{
				if( piece.startsWith( '--', ) )
					return { type:'attribute variable', content:piece, };
				else
					return { type:'attribute', content:piece, };
			}
			else
			if( piece.match( rg.join( rg.begin, colorRegexGen, rg.end, ).toRegExp(), ) || piece in colors )
				return { type:'value color', color:piece, content:piece, };
			else
				return { type:'text', content:piece, };
		}, );
	},
};
