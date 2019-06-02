import document from '../layout.js';

export default async ( { Response, }, )=> {
	
	return Response.newHTML( document, );
};
