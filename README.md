iGit
================================

**iGit** means interactive git, is a web base GUI for git, powered by [deno](https://deno.land). 

## Installation

1. Install deno

Follow https://deno.land: 
```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

2. Set environment

Deno and iGit will be installed in the DENO_DIR, which usually be `~/.deno` by default. 

You need ensure that `~/.deno/bin` or improved `${DENO_DIR:-$HOME/.deno}/bin` is in your PATH. 

When the command `deno` works on your CLI, that's okay.

3. Install iGit

```bash
deno --allow-env --allow-run --allow-read --allow-write https://igit.fenz.land/install.js
```

## Usage

Just run command `iGit` in your work directory, and open the echoed URL with your browser.
