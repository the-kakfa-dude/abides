## Node12/TypeScript3 Example with Quality Analysis via SonarQube (aka sonar)


This is a **bare-ish bones** sample Node project written in Typescript that scomes with a sonar server.

For truly bare-bones, look at the `ts_example` sibling project.


### Make This My Own

If you want to rename this project, and all the references to the project name,
you can run this filling in the name you want for "new_name":

```bash
  ./my_project.sh new_name
```

You should *do this first*, or on a fresh checkout of this project.


### TL;DR

Do this in one window:

```bash
  ./start-sonar-server.sh; tail -F sonar.log.txt
```

When it you see the log saying something like:

```bash
  sonarqube_1  | 1977.06.03 07:52:00 INFO  app[][o.s.a.SchedulerImpl] SonarQube is up
```

then you can ctrl-c it, or open a new window, and run these:

```bash
  # regular build and execute
  #
  ./clean.sh && ./build.sh && ./run.sh
```

```bash
  # docker build and execute
  #
  ./clean.sh && ./docker-build.sh && ./docker-run.sh
```

```bash
  # regular build that you then analyze with sonar
  #
  ./clean.sh && ./build.sh && ./sonar-run.sh
```

When that finishes, go here in a browser and go look at
your quality analysis reports:

  http://localhost:9000/dashboard?id=ts_sonar%3Aproject


If you want to run the whole command pipeline (including an auto-fix of your files
to ensure you respect the GTS coding convention, and a quality analysis push to the
sonar server), run this:

```bash
  ./clean.sh ; npm install && ./fix.sh && ./build.sh && ./run.sh && ./docker-build.sh && ./docker-run.sh && ./sonar-run.sh
```


### Build and Test

To build it, lint it, and test it, do this:

```bash
  ./build.sh
```

To build, lint, and test as a docker container, do this:

```bash
  ./docker-build.sh 
```

### Manual Build and Test

If you wanted to do those things by hand, it would look something like this:

```bash
  npm install

  tsc -p .

  npm outdated

  ./node_modules/.bin/gts check

  npm test
```

Or for docker:

```bash
#!/usr/bin/env bash

  docker build --no-cache --pull -t ts_sonar -f docker/Dockerfile .

  docker run -t --rm ts_sonar:latest ./check.sh

  docker run -t --rm ts_sonar:latest npm test
```

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

NOTE: If you just did a `./clean.sh`, these commands will fail, as they look
for a local copy of `gts`. To fix that, do an `npm install` or a `./build.sh` first.

NOTE: If you have npm installed gts globally, you could also run a `gts check` or `gts fix` directly.


### Execution

To run the ts_sonar, run something like this:

```bash
  node build/src/index.js
```

Or use the npm target:

```bash
  npm run execute
```

There is a also a helper script:

```bash
  ./run.sh
```

that is used when we launch a `docker-run.sh`:

```bash
  ./docker-run.sh
```

which looks like this:

```bash
  docker run -t --rm ts_sonar:latest ./run.sh
```

Regardless of which way you run it, the expected output should look like this:

```bash
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut aliquet diam.
Semicolon
[ 'am I tabbed?' ]
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


### Cleanup

To delete the artifacts that get generated from the commands ^^^, do this:

```bash
  ./clean.sh
```

To do that by hand, try something like this:

```bash
./node_modules/.bin/gts clean || rm -rf ./build

rm -rf ./node_modules ./coverage ./.scannerwork ./test-report.xml

docker rm $(docker ps -a | grep 'ts_sonar:latest' | awk '{print $NF}')

docker rmi $(docker images | tr -s ' ' | grep 'ts_sonar latest' | cut -d' ' -f3)

docker image prune --force
```

NOTE: We don't attempt to delete any IDE directories like Visual Studio's .vscode,
but we have added that one to a .gitignore, so feel free to follow that pattern for
different IDEs. If you do, you may also want to add your dirs to the `exclude` block
in the `testPathIgnorePatterns` section of the `jest.config.js`.

NOTE: We don't delete any sonar stuff.


### Why So Few Comments In The Code???

If this project ever gets so non-trivial that it requires comments beyond the few ones
already included, you should `git rm` the whole thing and start over with a better ts_sonar.


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
  npm install typescript@3.6.4 -g
  npm install gts@1.1.0 -g
```


### Debuggers

Here's a launch.json for vscode.


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
      "name": "Debug Unit Tests",
      "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
      "cwd": "${workspaceRoot}",
      "args": ["--no-cache", "--runInBand", "--config", "jest.config.js", "--testPathPattern='/test/'"],
      "sourcemaps": "inline",
      "disableOptimisticBPs": true
    }
  ]
}
```


### Enjoy!

