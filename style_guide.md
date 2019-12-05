
## Files

#### The encoding of file MUST be utf-8

#### Line endings MUST be LFs

#### A JS file MUST be a ES Module

#### Normal Files

Normal file name MUST be not named 'index', 'modules'. 
(the name 'index', includes 'index.js', 'index.\*.js'...). 
Instead of 'index.js', you can use 'main.js' instead. 

#### File head
static reference statements, known as `import` or `export from`, 
must write on the head of a file, without any comments or empty lines before or between them. 
In other worlds, only shebang line can before static reference statements. 
There must be a double empty lines between static statements and other codes. 
One static statement a line. 
If there is no static reference, the first line of the file must be a empty line.

Recommended
```javascript
import './foo.js';

/**
 * Comment of file
 * 
 * @author somebody
 */

const foo= 'bar';
// ...
```
Recommended
```javascript

const foo= 'bar';
// ...
```

Against
```javascript
/**
 * Comment of file
 * 
 * @author somebody
 */

import './foo.js';
```

Against
```javascript
const foo= 'bar';
```

##### static references MUST be ordered
'export from' must after import.
You can choose a rule you like. Such as ASCII order, from short to long...
There MUST be a definite order.

### ;,

#### statements MUST end with ";"

#### use trailing comma everywhere

### indentation
MUST use indent characters, or as known as tabs, for indentation. 
space character can use before the code and after indentation for non-logical alignment, 
but not about logic structure. 
Empty lines MUST also be indented. 
Starting and Ending signs MUST in line of correct indent level.

Recommended
```javascript
class Foo
{
	constructor()
	{
		this.foo= 'foo';
		
		this.bar= 'bar';
	}
}
```

Against
```javascript
class Foo
{
	constructor()
	{
		this.foo= 'foo';

		this.bar= 'bar';
	}
}
```

Against
```javascript
class Foo
{
  constructor()
  {
    this.foo= 'foo';
    
    this.bar= 'bar';
  }
}
```

Against
```javascript
class Foo
{
    constructor()
    {
        this.foo= 'foo';
        
        this.bar= 'bar';
    }
}
```

Against
```javascript
class Foo
{
        constructor()
        {
                this.foo= 'foo';
                
                this.bar= 'bar';
        }
}
```

Starting signs are `(`, `[`, `{`.
Ending signs are `)`, `]`, `}`, `;`, `,`.

Recommended
```javascript
const foo= (
	/* ... */
);
```

Against
```javascript
const foo= 
	(/* ... */) // the `(` and `)` should in line of indent level 0, but in 1 actually.
;
```
```javascript
fetch(/* ... */)
	.then(/* ... */)
	.then(/* ... */)
	.then(/* ... */)
;
```

Against
```javascript
fetch(/* ... */)
	.then(/* ... */)
	.then(/* ... */)
	.then(/* ... */); // the `;` should in line of indent level 0, but in 1 actually.
```

Why use indent characters rather then space for indentation: 
That's two different requirement for indentation and alignment. 
Space characters are the better one for alignment, of cause, but not for indentation. 
Someone use two space but some others use four. 
On the other hand, a indent character clearly means one logic level. 
And you can set the indent width as your wish. 

Why indent the Empty line: 
The traditional and most populate way is make empty lines strictly empty, 
forbidden any whitespace within, because you cannot see them. 
But for now, all modern editors can render spaces and tabs. The problem is gone. 
Code style standards or guilds should not forbidden trailing whitespace anymore. 
For empty line, the logic level should be kept, so do the indentation. 
And what's more, non-indent empty line will confuse your git diff. 


### for-in

Must not use for-in loop, use for-of Object.keys or Object.entries instead. 

Recommended
```javascript
for( const key of Object.keys( object, ) )
	// ...

for( const [ key, item, ] of Object.entries( object, ) )
	// ...
```

Against
```javascript
for( const key in object )
	// ...
```

### spaces

#### Editors MUST always show the whitespace characters. 

#### =
when `=` as assign operator, no space before, one or more(for alignment) space(s) after it. 
when `=` as default operator, neither space before nor after it. 
when `=` as equal operator, both spaces before and after it. 

Recommended
```javascript
const foo= foo();
function foo( bar='bar', )
{
	if( foo == bar )
		;
	if( foo === bar )
		;
}
```

Against
```javascript
const foo=foo();
const foo =foo();
const foo = foo();
function foo( bar= 'bar', )
{
	if( foo==bar )
		;
}
function foo( bar ='bar', )
{
	if( foo ==bar )
		;
	if( foo== bar )
		;
}
function foo( bar = 'bar', )
{
	if( foo ==bar )
		;
	if( foo== bar )
		;
}
```

By the way, that's too verbose, a better syntax is use `foo = bar` instead of `foo === bar`, 
and `foo= bar` for assign bar to foo. 
 

#### `? :`, space after `?` and `:`
Recommended
```javascript
foo? foo(): bar();
foo? foo(): bar? bar(): baz? baz(): failBack();
```

Against
```javascript
foo ? foo() : bar();
foo?foo():bar();
```

#### `&&` and `||`
As logic operator, spaces around. 
As substitute operator, no space before and a space after. 
As condition operator, a space before and no space after. 

Recommended
```javascript
(isFoo() && hasBar()) &&(foo= getBar()|| makeBar());

```

Against
```javascript
(isFoo()&&hasBar()) &&(foo= getBar() || makeBar());
```

#### `if` `for` ...

no space outside the `()` but both left and right inside.

Recommended
```javascript
if( a === 1 )
	;

```

Against
```javascript
if (a === 1)
	;
```


### variable
If a variable is not be changed. Use `const` instead of `let`.
Keyword `let` means that the variable is changing.


Recommended
```javascript
{
	const foo= 1;
	const bar= getBar( foo, );
	const baz= { foo, };
	
	baz.bar= bar;
}
```

Against
```javascript
{
	let foo= 1;
	let bar= getBar( foo, );
	let baz= { foo, };
	
	baz.bar= bar;
}
```

#### Do not change a parameter

Always assume a parameter as a constant with `count` instead of a variable with `let`.
If it's need be changed, use `let` explictly.

Recommended
```javascript
function foo( initBar, )
{
	let bar= initBar;
	
	++bar;
}
```

Against
```javascript
function foo( bar, )
{
	++bar;
}
```

#### + operator
Operator `+` is confusing. You will not know the `+` in `a + b` means add or join. 
So MUST not use `+` as a binary operation. 
MUST use `a - - b` to add two value, and \`${a}${b}\` to join two string. 

#### % operator
This is a mistaken operator from C language.
So MUST NOT use `%` as mod operator, MUST use a function instead. 

#### type converting

MUST use `[[Type]] (value)` to convert types. 

Recommended
```javascript
Boolean (value);
String (value);
Number (value);
Object (value);

// BigInt (value) will cause errors in many, 
BigInt (value<<0);

// this is not converting but constructing
Symbol( label, );
```

Neutral
```javascript
!!value; // not bad but not unified

// There is no better way to convert value to integer. 
// Number.parseInt is a base converter rather then type converter, and it's returns NaN but NaN is not a integer. 
value<<0;
value>>0;
value>>>0;
~~value;

// as well
BigInt (value>>0);
BigInt (value>>>0);
BigInt (~~value);
```

Against
```javascript
BigInt (value); // cause errors

+value; // + operator is forbidden, and this will cause error when typeof value === 'bigint'

'' + value; // + operator is forbidden, and not readable
`${value}`; // not not readable

Boolean( value, );
String( value, );
Number( value, );
BigInt( value, );
Object( value, );

Symbol (label);
```



### docblock
A function or a method need a docblock.
Which at least contains a simple introduce, @param if exists

#### type
type symbol for param or return.
object: `{SomeClass}`, `{} is short for {Object}`; value: `(string)`; abstract type `<void>`, `<any>`;
Promise: `~{SomeClass}`, `~(number)`, `~<any>`, `~` is short for `~<>` or `~<void>`;
ValuedObject: `{}:{SomeClass}`, `{Variable}:(number)`, `{Constant}:(number)` for an object instance of `Constant` with valueOf() returns a `number`;
State: `${SomeClass}`, `$(number)`, `$<any>`, `$` is short for `$<>` or `$<void>`;
Function: `=>{SomeClass}`, `(string),(number)=>(boolean)`, `=><any>`, `=>` is short for `<void>=><void>`, `()=><any>` for `(...<any>)=><any>`;
Tuple: `[ {SomeClass}, (string), ]`;
Array: `[]{SomeClass}`, `[]` is short for `[]<any>`;
Iterator: `...{SomeClass}`, `...(string)`, `...<any>`;
Dictionary: `{ key0:{SomeClass}, key1:{SomeClass}, }`, `{ (string):{SomeClass}, }`, `{:}` is for any dictionary, `Map{ {KeyClass}:{ValueClass}, }`;
Strict value: `|SomeObject|`, `|SomeClass|`;
Enum: `|value_0|value_1|value_2|`;
Symbol: `#name#`;
Optional: `?{SomeClass}`, `?(string)`, `?<any>`;
MultiTyped: `<{SomeClass}|(string)|[](string)>`

Abstract types:
	`<>` or `<void>` for return nothing.
	`<any>` for access or return anything.
	`<mixed>` for access or return something multi-typed, but not anything
	`<any#flag>`, `<mixed#flag>` flag can be any word, such as `<any#item>`, `<mixed#parent>`. Types in same doc block, with the same flag must match.


#### @param
syntax: 
```javascript
/**
 * @param name type  descriptions
 */
```

multi type:
```javascript
/**
 * @param name type0  descriptions
 *             type1  descriptions
 *             type2  descriptions
 */
```

member functions not defined in a class MUST declare the @context doc.

```javascript
/**
 * A member function
 * 
 * @context {Foo}
 *          {Bar}
 * 
 */
function someMethod()
{
	this.foo= 'foo';
}

/**
 * A static member function
 * 
 * @context Foo
 *          Bar
 * 
 */
function someStaticMethod()
{
	this.foo= 'foo';
}

Foo.prototype.someMethod= someMethod;
Foo.prototype.someMethod= someMethod;

Foo.someStaticMethod= someStaticMethod;
Foo.someStaticMethod= someStaticMethod;

```


### import and export
Never use `export let` or `export var`; use `export function getFoo(){}` instead.
Never use `export {}`; use `export default`, `export class`, `export function`, `export const`, `export from` instead.

* class file: `export default class`, named same as the class, FlagCase. 
  use the same name when import, if need to rename, use `{ default as NewName, }`. 
  not import dinamically. 

* module file: without `export default`, named with barbecue-case. 
  splite importing usually. import whole module, use FlagCase. 
  not import dinamically. 

* component file: named with snake_case, 
  import whole module usually, typically import dinamically, use snake_case with the same name. 

* value file: holds values, export one value with default or multiple values. named with camelCase. 
  use camelCase with the same name.
  when dinamically import, use destructuring assignment always. 




Class File
```javascript

export default class
...
export const other= 1;
```
```javascript
import FooClass from 'FooClass.js';
import { default as BarClass, } from 'FooClass.js';
import FooClass, { other, } from 'FooClass.js';
```

Module file
```javascript
export function foo()
...
export function bar()
...
```
```javascript
import { foo, bar, } from 'foo-bar.js';
import * as Bar from 'bar.js';
```

Component File
```javascript
export default ...
export ...
```
```javascript
import * as foo_bar from 'foo_bar.js';

const foo_bar= await import ('foo_bar.js');
```

Value File
```javascript
export default {};
```
```javascript
import fooBar from 'fooBar.js';

const { default:fooBar, }= await import ('fooBar.js');
import ('fooBar.js').then( ( { default:fooBar, }, )=>{...}, );
```
```javascript
export const fooBaz= {};
export const barBaz= {};
```
```javascript
import { fooBaz, barBaz, } from 'fooBar.js';

const { fooBaz, barBaz, }= await import ('fooBar.js');
import ('fooBar.js').then( ( { fooBaz, barBaz, }, )=>{...}, );
```


#### Index and Modules Files

An index file MUST be named 'index'. 
An modules file MUST be named 'modules'. 
For the index files, only two kinds of statements are allowed: `import` without `from`, `export` with `from`.
For the modules files, only `export` with `from`.
Comment lines and empty lines can be written before or between static lines for index files. 

index files can only import local files. 
modules files can only import net files. 



#### async programing

All functions return promise must be decorated by `async`. 
A promise MUST only stage in `const` variable that starts with `$`. 
Non-promise variable cannot starts with `$`. 
Must no `await` follows `return`.

Recommended
```javascript
async function getFoo()
{
	return Promise.resolve();
}

const $foo= getFoo();
const foo= await $foo;
```

Against
```javascript
function getFoo()
{
	return Promise.resolve();
}

async function getFoo()
{
    return await Promise.resolve();
}

let foo= getFoo();
foo= await foo;
$foo= await getFoo();
```

#### block `{}`
for non-expressional blocks, a line-feed before `{` and after `}`.
includes class body, class methods, non-expressional functions, if, for...

for expressional blocks, no line-feed before `{` and after `}`.
includes expressional classes, object methods, expressional functions, arrow functions.

Recommended
```javascript
class Foo
{
	method()
	{
		function func()
		{
			if( Array.isArray( this, ) )
			{
				for( let item of this )
				{
					
				}
			}
			else
			{
				do
				{
					
				}
				while( true );
			}
		}
	}
}
```

Against
```javascript
class Foo {
	method(){
		function func() {
			if( Array.isArray( this, ) ) {
				for( let item of this ){
					
				};
			} else {
				do {
					
				}while( true );
			};
		};
	};
};
```

Recommended
```javascript
return class Foo {
	
};

const foo= function alias(){
	return {
		method(){
			
		},
	};
};
```

Against
```javascript
return class Foo
{
	
}

const foo= function alias(){
	return {
		method(){
			
		},
	};
};
```
There are some easy ways to separate expressional and non-expressional classes or functions: 
1. Don't add `;` at the end, and add a pair of `(0);` at the next line. Then run it. 
A expressional function or class (is a function too) will be called, but a non-expressional one won't. 
2. Don't add `;` at the end, and add ` -1;` at the next line. Then run it. 
If you got the function or class itself, that's non-expressional; but if you got `NaN`, that's expressional.
3. ...

```javascript
const foo= function fooBar( arg, ){
	return arg;
}
(0);
// foo === 0, the function be called, it's a expressional function.

export default function fooBar( args, )
{
	
}
-1;
// the module exports the function itself rather then NaN, it's a non-expressional function.
```

#### undefined and null

As the name, `undefined` means the variable or property is not defined, or, not exists. 
But `null` means the variable or property exists, but empty. 
So when you declare a variable or property, but not set value immediately, 
generally set `null`. Only if it's the same as the variable or property is not exists, use `undefined`. 
Must write `= undefined` explicitly, rather than just not set the value. 
Use `=== undefined` and `=== null` instead of truely determination.

Recommended
```javascript
let emptyBox= null;
let notExistVariable= undefined;

class Foo
{
	emptyBox= null;
	#notExistProperty= undefined;
}

if( notExistVariable !== undefined )
	;
```

Against
```javascript
let emptyBox= undefined;
let notExistVariable= null;

class Foo
{
	emptyBox= undefined;
	#notExistProperty;
}

if( notExistVariable )
	;
```

### Classes

Do not use public properties, use getter/setter and private properties instead. 
If a property need to extends and override, `use getFoo()` instead of `get foo()`. 
use `async getFoo()` instead, before `async get foo()` not supported. 
use
```javascript
class Foo
{
	constructor()
	{
		return (async ()=> {
			//...
			return this;
		})();
	}
}
```
instead, before
```javascript
class Foo
{
	anync constructor()
	{
	}
}
```
supported. 




Recommended
```javascript
```

Against
```javascript
```

```php
$ifFoo ?$foo :$bar;
$ifFoo
	?$foo
	:$bar
;
$ifFoo
	?$foo
	:($ifBar
		?$bar
		:$baz
	)
;
```

```javascript
$ifFoo? $foo: $bar;
$ifFoo? $foo:
$bar;
$ifFoo?
	$foo:
$bar;
$ifFoo? $foo:
$ifBar? $bar:
$baz;
```
