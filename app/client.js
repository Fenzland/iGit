import { file_exists, } from './modules.deno.js';

/**
 * Open client powerd by Google Chorem
 * 
 * @param host       (string)
 * @param 1.required (boolean)  If required, an error will be throw when Google chrome is not found
 * 
 * @return <>
 */
export async function openClient( host, { required, }, )
{
	const command= await getChromeCommand();
	
	if(!( command ))
	{
		if( required )
			throw new Error( 'iGit client required Google Chrome', );
		else
			return;
	}
	
	const chrome= Deno.run( { args: [ command, `--app=http://${host.replace( /0\.0\.0\.0:|^:/, '127.0.0.1:', )}`, ], stdin:'null', stdout:'null', stderr:'null', }, );
}

/**
 * Get command of Google Chorme according to different OS
 * 
 * @return ?(string)
 */
async function getChromeCommand()
{
	if( Deno.platform.os !== 'win' && Deno.platform.os !== 'windows' )
		return getLinuxChomeCommand();
	else
		return getWindowsChomeCommand();
}

/**
 * Get command of Google Chorme on Linux
 * 
 * @return ?(string)
 */
async function getLinuxChomeCommand()
{
	const checkChrome= Deno.run( { args:[ 'which', 'google-chrome', ], stdin:'null', stdout:'null', stderr:'null', }, );
	
	return  (await checkChrome.status()).success? 'google-chrome': null;
}

/**
 * Get command of Google Chorme on Windows
 * 
 * @return ?(string)
 */
async function getWindowsChomeCommand()
{
	const commands= [ 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe', ];
	
	for( let command of commands )
	{
		if( (await file_exists( command )) )
			return command;
	}
	
	return null;
}
