import document from '../layout.js';

export default async ( { request, Response, }, )=> {
	
	return Response.newHTML( document, );
};
