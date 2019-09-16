iGit
================================

**iGit** means interactive git. It's contains a web sever and a web base GUI client for git. 

The iGit is powered by git, deno and Vue.js. 

The deno is currently under develop, so do the iGit. 
For now, you can try iGit and find some ideas. 
If you have better ideas, issues are welcome. 

## Access iGit

First of all, you need install [deno](https://github.com/denoland/deno_install) and [git](https://git-scm.com/downloads). 

iGit requires:
* git >= 2.18
* deno >= 0.4

Recommand client:
* Google Chrome >= 74

There are three way to access iGit: 
1. ~Run with url, without install~ (not recommand before stable vesion is relased). 
2. ~Install normally~ (not recommand before stable vesion is relased). 
3. Install with `--dev`. 

### Install with `--dev`

```bash
deno run --reload --allow-env --allow-run --allow-read --allow-write https://igit.fenz.land/install.js --dev
```

By this way, this git repository will be clone into `$DENO_DIR/iGit` directory. 
And the command `iGit` will be registered. 
You can run `iGit` under a git repository, and run `iGit --help` to get helps. 
You can switch version with `git checkout` under the iGit source code directory. 
You can even modify the source code and try it out immediately. 

### develop schedule

At this moment, iGit is waiting for a UI framework named Butterfly for a better performance. 
And I'm focus on the Butterfly too. 
