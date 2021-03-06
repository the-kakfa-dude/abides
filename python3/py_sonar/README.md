## Python3 Example with Quality Analysis via SonarQube (aka sonar)

This is a **bare-ish bones** sample Python 3 project that comes with a sonar server.

For truly bare-bones, looke at the `py_example` sibling project.


### Make This My Own
If you want to rename this project, and all the references to the project name,
you can run this filling in the name you want for "new_name":
```bash
  ./my_project.sh new_name
```

You should *do this first*, or on a fresh checkout of this project.


### TLDR

Do this in one window:
```bash
  ./start-sonar-server.sh; tail -F sonar.log.txt 
```

When it you see the log saying something like:
```bash
  sonarqube_1  | 1988.08.08 07:52:00 INFO  app[][o.s.a.SchedulerImpl] SonarQube is up
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
  ./clean.sh && ./build.sh && ./sonar-build.sh && ./sonar-run.sh
```

When that finishes, go here in a browser and go look at
your quality analysis reports:

  http://localhost:9000/dashboard?id=py_sonar%3Aproject


#### Where are my code police violations???

When you do this for the first time, before putting _your_ code in this sample project, you won't see any code smell, even though you can see them in the flake8 and pylint output. That's because the default Quality Profile in sonar has those formatting problems turned off. If you want to start turning those on, you have to log in (admin/admin) and start messing around.

This page will show you how to copy the default `C#` Quality Profile, and start customizing it. It's the same thing for Python:

https://improveandrepeat.com/2017/12/customise-the-rules-in-sonarqube/

You can then start turning rules on and off one at a time in that profile.

Don't forget to set your new quality profile to the default profile.

If you want the full picture of stuff to clean up, you can bulk activate all the rules in your new quality profile, and then start turning them off where they're being nit-picky. If you do this in this empty sample project, you'll see there are a lot of code smell violations, but turning off 2 or 3 formatting rules will take care of all of that.

#### Changing the Rules and them Actually Showing Up???

If you change the rules, you have to rerun the sonar-run.sh script.

If you also changed your code, you should first run the build.sh script, followed by the sonar-build.sh script.


### Done For The Day

When you've fixed all the bugs and cleaned up all the code,
you can stop your sonar server, and clean up, like this:

```bash
  ./stop-sonar-server.sh
  ./clean.sh
```

Have no fear, when you start sonar up next time, your Quality Analyses
projects and reports will still be there.

(unless you start `docker volume rm`-ing or `docker volume prune`-ing or ...

If you were tailing the sonar log, you can ctrl-c it now.

### Scripts

clean.sh
 - deletes old kruft.

build.sh
 - builds the code, runs the linter, and runs the tests.
   you need to do this to get a sonar report.

run.sh
 - runs the code. 

docker-build.sh
 - builds, lints, and runs the test, this time inside a new docker container.

docker-run.sh
 - runs that docker container.

sonar-build.sh
 - builds the docker container that runs the sonar coverage report, using the current regular build state.

sonar-run.sh
 - runs the sonar coverage report in that container.

start-sonar-server.sh
 - starts the sonar server. 

stop-sonar-server.sh
 - stops the sonar server. run this when you're done for the day.

my_project.sh
 - on a fresh checkout of this sample project, you can pass this script a new project name, and it will update all the `py_sonar` hardcoded references.


### Why comments this time ???

If you look at the `py_example` sibling project, we state specifically that we make no comments on purpose, because it's supposed to be so simple, you don't need them. But in this project, getting all the sonar stuff correct is subtle, and needs some `blah blah blah` here and there.

Enjoy!
