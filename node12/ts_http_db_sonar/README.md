## Node12/TypeScript3 Example with Quality Analysis and Database

This is a **bare-ish bones** sample Node project written in Typescript
that scomes with a sonar server, and a postgres database for functional tests
that we interact with via the `typeorm` database helper.

If you don't need functional tests or a database, try the `ts_sonar` project instead.

The bare-bones project is called `ts_example`.


### Make This My Own

If you want to rename this project, and all the references to the project name,
you can run this filling in the name you want for "new_name":

```bash
  ./my_project.sh new_name
```

You should **do this first**, or on a fresh checkout of this project.


### Database

Start the Postgres database ahead of time, because the initial download of the
postgres docker container can be slow.

```bash
  ./start-db.sh ; tail -F postgres.log.txt
```

You can `ctrl-c` out of ^^^ whenever you like and check the log later if you want.

You can also run that more than once without messing with the database, although
you will lose your log if you do.

You'll know the database is ready when you see something like this in the log:

```bash
  test_db_1  | 2112-04-20 23:58:00.704 UTC [1] LOG:  database system is ready to accept connections
```

If you think the database got screwed up, try this:
```bash
  ./reset-db.sh
```


### Quality Analysis

You'll also need to start a docker-compose for the SonarQube server.
We use that to see what our code coverage looks like, and get suggestions
about coding style, possible bugs, security violations, and the like.
Starting this server for the first time can also be slow.

Do this in a new window:

```bash
  ./start-sonar-server.sh ; tail -F sonar.log.txt 
```

It'll be done initializing when it you see the log saying something like this:

```bash
  sonarqube_1  | 2016.05.06 00:15:59 INFO  app[][o.s.a.SchedulerImpl] SonarQube is up
```

You can go here to see the SonarQube server:

  http://localhost:9000

To stop it, run:

```bash
  ./stop-sonar-server.sh
```


### A Clean Build

I'm a scorched-earth kind of guy, in that I prefer to wait an
extra minute to nuke my system and rebuild it all from scratch,
as opposed to futzizng around for an hour with a corrupted system
that I don't really care to diagnose or fix.

Call me crazy.

This also has the added benefit of helping you catch
situations where you actually broke your code an hour ago,
but you have some old build artifact hanging around that
makes it look like it still works.

In these situations what you want is a "clean build",
which you can get like this:

```bash
  ./clean.sh && ./build.sh
```

This will basically nuke all the generated artifacts,
including the `npm install` artifacts, re-install them
all, and then run your checks and tests.

#### clean.sh

When you run a `./clean.sh` it will:
 - stop the database,
 - delete the database storage,
 - delete the docker image for this `ts_http_db_sonar` project,
 - remove all the build and run artifacts.
 - truncate the postgres log,
 - exit happy.

 It will not do anything to the sonar server.


#### build.sh

When you do a `./build.sh`, it will:
 - start the database,
 - install our node packages (aka `npm install`),
 - check for outdated package versions,
 - check for Google Typescript Style violations,
 - compile the code,
 - run the unit tests,
 - ensure all database migrations have been run,
 - run the functional tests


#### Clean/Build And Run

Once it's cleaned and compiled, and passes all checks and tests,
the final proof that it works is found by running it.

```bash
  ./clean.sh && ./build.sh && ./run.sh
```

If you want something a little faster, try this:

```bash
  ./clean.sh && ./start-db.sh && npm install && npm run compile && npm run migration:run && npm test && ./run.sh
```

If you don't care about tests and cleaning databases,
this takes less than 10 seconds. It'll drop the compiled code,
recompile it, and then invoke both of the main entry points.

```bash
  npm run clean && npm run compile && npm run launch:index && npm run launch:app
```

You will notice we have two main entry points when we "run the code".

The first one is `src/index.ts`. It is covered by only unit tests.

The second one is `src/app.ts`. It talks to the database, and thus,
is covered by our functional tests.


### Docker Build, Test and Run

To build, lint, and test as a docker container, and then invoke both 
index.ts and app.ts, run this:

```bash
  ./docker-build.sh && ./docker-run.sh
```

NOTE:
This will reset the database for its run of the functional tests.


### Quickly ReRun Functional Tests

If you have a happy system, and you want to quickly iterate on changing
the functional tests code paths, try this:

```bash
  ./rerun-func-tests.sh
```

It reverts all the database migrations (dropping any accumulated
state),tells gts to remove the build, recompiles the code to pickup
any database-related changes (like ORM model tweaks), puts the migrations
back up, and then runs the functional tests.

It does this without restarting or resetting the database, 
and it takes about 10m seconds.

This is what you want to iterate on when playing around with the ORM or DAOs.

NOTE:
It will **not** generate or run any new migrations. Those you have to do by hand.

NOTE:
Unless you apply the hack below.


### Database Migrations

Any time you make database changes to the data models in `src/entity/` where
the typeorm code is, you need to apply those changes to the database by hand.
To do this, you need to create a database migration, and then run it. For example,
if you added a `media_type` column to the `photo` table, and you wanted to call
that change to the database schema `MediaType`, you would create your migration
like this:

```bash
  npm run migration:generate -n MediaType
```

After you do this, you need to deploy those schema changes to the database,
which you can do like this:

```bash
  npm run compile
  npm run migration:run
```

You will notice that `gts` will complain about the style of the migration code,
so you should run a `./fix.sh` before checking in a new migration.


### Avoiding Database Migrations (dev-only)

There is also a really easy way to cheat around this system.

Find the reference in the typescript code to `synchronize: false`
(where we specify the database connection config params in
`getConnection()`), and reset that config param to `true`.

You will find it around line 28 of `src/dao/utils.ts`

Now when you change the ORM code, and run the code/tests, your schema
changes will get automatically pushed to the database.

NOTE:
You _really_ don't want to do this in production, because you can
accidentally **lose all your data**.


### Lint It and Fix It

This project uses the Google Typescript Style as its coding convention.
To check if you've coded to that convention, or if you have outdated
node packages installed, run this:

```bash
  ./check.sh
```

If you've violated the GTS convention, you can auto-fix it by running this:

```bash
  ./fix.sh
```

Taken together, these are equivilent to a:

```bash
  gts check ; gts fix
```

NOTE: If you just did a `./clean.sh`, these commands will fail, as they look
for a local copy of `gts`. To fix that, do an `npm install` or a `./build.sh`.

NOTE: If you did a global install of gts (i.e. `npm install gts -g`), you could
also run a `gts check` or `gts fix` directly, as above.


### Execution

#### src/index.ts

To run the first main entry point `index.ts`, run this:

```bash
  node build/src/index.js
```

Or use the npm target:

```bash
  npm run launch:index
```

It should produce the following output:

```bash
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut aliquet diam.
Semicolon
[ 'am I tabbed?' ]
```

#### src/app.ts

To run the second main entry point `app.ts`, run this:

```bash
  ./node_modules/.bin/ts-node src/app.ts
```

Or use the npm target:

```bash
  npm run launch:app
```

It should produce something like the following output:

```bash
[{"id":1,"name":"the real photo","isPublished":true}]
```

You will notice that the integer value of `id` will increase
every time you run the app. This is because the application code
will add and remove a the same photo over and over again,
causing the serial primary key to increment on every insert
into the `photo` table.

There is a also a helper script that will run both of thesee entry points:

```bash
  ./run.sh
```


### Sonar

No sonar build is required in typescript, just a sonar run, which you can do like this:

```bash
  ./sonar-run.sh
```

which is the same as a:

```bash
  node sonar-push.js
```


### Scorched Earth

When things get wierd, run this, and then walk away for a couple of minutes:

```bash
  ./clean.sh && ./build.sh && ./run.sh && ./docker-build.sh && ./docker-run.sh && ./sonar-run.sh 
```


### Done For The Day

To delete the artifacts that get generated from the commands ^^^,
and to stop the database and wipe it clean, do this:

```bash
  ./clean.sh
```

NOTE: We don't attempt to delete any IDE directories like Visual Studio's `.vscode`,
but we have added that one to a `.gitignore`, so feel free to follow that pattern for
different IDEs. If you do, you may also want to add your new dirs to the `exclude`
block of `jest.config.js`, in the `testPathIgnorePatterns` section.

You may also wish to stop your sonar server:

```bash
  ./clean.sh && ./stop-sonar-server.sh 
```

Don't worry about losing sonarqube data. We _never_ delete any sonar stuff,
as all the projects share the same sonarqube state.


### None Of This Works!!!

These instructions assume you have almost nothing installed globally,
but you do need a copy of Node 12, which you can find here:

https://nodejs.org/dist/v12.12.0/

It might look like you need to download the source tarball and build,
but if you're on a mac like me, this is the package installer, where
all you need to do is click:

https://nodejs.org/dist/v12.12.0/node-v12.12.0.pkg

If it still doesn't work, I recommend the following global installs:
```bash
  npm install typescript@3.7.2 -g
  npm install gts@1.1.0 -g
```

### Debuggers

Here is a a sample `launch.json` for Visual Studo Code.

It contains launch targets for both main entry points,
one using node on the build directory for `index.js`,
and one running `ts-node` on `app.ts`.

It also contains debugging targets for:
 - the current test file,
 - all the tests,
 - the unit tests,
 - the functional tests.

All tests are run sequentially, along with a couple of
other settings that might help with flaky breakpointing.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch build/src/index.js (node)",
      "program": "${workspaceFolder}/build/src/index.js"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch src/app.ts (ts-node)",
      "runtimeArgs": [
          "-r",
          "ts-node/register"
      ],
      "args": [
          "${workspaceFolder}/src/app.ts"
      ]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current Test",
      "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
      "cwd": "${workspaceRoot}",
      "args": ["${fileBasenameNoExtension}", "--no-cache", "--runInBand", "--config", "jest.config.js"],
      "sourcemaps": "inline",
      "disableOptimisticBPs": true
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug All Tests",
      "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
      "cwd": "${workspaceRoot}",
      "args": ["--no-cache", "--runInBand", "--config", "jest.config.js"],
      "sourcemaps": "inline",
      "disableOptimisticBPs": true
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Unit Tests",
      "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
      "cwd": "${workspaceRoot}",
      "args": ["--no-cache", "--runInBand", "--config", "jest.config.js", "--testPathPattern='/test/'"],
      "sourcemaps": "inline",
      "disableOptimisticBPs": true
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Functional Tests",
      "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
      "cwd": "${workspaceRoot}",
      "args": ["--no-cache", "--runInBand", "--config", "jest.config.js", "--testPathPattern='/func/'"],
      "sourcemaps": "inline",
      "disableOptimisticBPs": true
    },
  ]
}
```

### Enjoy!

