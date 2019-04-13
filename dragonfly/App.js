import { httpServer, } from './modules.deno.js';

/**
 * main Application class of Dragonfly
 */
export default class App
{
	/**
	 * Listen a host with HTTP
	 * 
	 * @param host (string)
	 * 
	 * @return ~<void>
	 */
	async listenHTTP( host, )
	{
		for await( const denoRequest of httpServer.serve( host, ) )
		{
			denoRequest.respond();
		}
	}
}
