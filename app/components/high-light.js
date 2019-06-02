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
};
