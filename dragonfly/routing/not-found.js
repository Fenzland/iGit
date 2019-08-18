import Route from './Route.js';
import Response from '../http/Response.js';

const html= /*HTML*/`
<h1>404 Page Not Found</h1>
`;

export default ( { request, }, )=> {
	
	if( request.accept.match( 'application/json', ) > 1 )
		return Response.newJSON( { status:404, message:'Not Found', }, { status: 404, }, );
	else
		return Response.newHTML( html, { status: 404, }, );
};
