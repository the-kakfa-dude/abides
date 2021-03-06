# Python3 Example with Quality Analysis and a Database

This is a **semi-mature** sample python 3 project that comes with a sonar server,
and a postgres database for functional tests.

If you don't need functional tests or a database, try the `py_sonar` project instead.

The bare-bones project is called `py_example`.


### Make This My Own

If you want to rename this project, and all the references to the project name,
you can run this filling in the name you want for "new_name":

```bash
  ./my_project.sh new_name
```

You should **do this first**, or on a fresh checkout of this project.


## Database

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
test_db_1  | 1995-08-89 23:51:12.704 UTC [1] LOG:  database system is ready to accept connections
```


## Quality Analysis

You'll also need to start a docker-compose for the SonarQube server.
We use that to see what our code coverage looks like, and get suggestions about coding style,
possible bugs, security violations, and the like.
Starting this server for the first time can also be slow.

Do this in a new window:

```bash
  ./start-sonar-server.sh ; tail -F sonar.log.txt 
```

It'll be done initializing when it you see the log saying something like this:

```bash
  sonarqube_1  | 1988.08.08 07:52:00 INFO  app[][o.s.a.SchedulerImpl] SonarQube is up
```

You can go here to see the SonarQube server:

  http://localhost:9000

To stop it, run:

```bash
./stop-sonar-server.sh
```

## Regular Clean, Build and Run 

### clean.sh

When you run a `./clean.sh` it will:
 - stop the database,
 - delete the database storage,
 - delete the docker image for this `py_db_sonar` project,
 - remove the python virtual environment,
 - remove all the build and run artifacts.
 - truncate the postgres log,
 - exit happy.
 
 It will not do anything to the sonar server.


### build.sh

When you do a `./build.sh`, it will:
 - deactivate any current virtual environment,
 - remove the local virtual environment,
 - create a new local virtual environment,
 - install the `py_db_sonar` python project into that venv,
 - run flake8 on everything,
 - run pylint on each of the `py_db_sonar` source directories
   - py_db_sonar
   - tests
   - functional_tests
 - run the unit tests
 - reset the test database
 - run the functional tests.
 

### run.sh

It just runs the main method.

### Clean It, Build It, Run It

This is what you want to start from scratch on your build:

```bash
  ./clean.sh && ./build.sh && ./run.sh
```


## Docker Built It, Run It

### Pro Tip: Don't do a clean, or you have to build again.

A docker build will basically do what a regular build does, but it does it inside a docker container.
The name of the container is `py_db_sonar:latest`, and if you poke around docker, you can find the image.
The docker run executes the `py_db_sonar` main method from inside the container, giving it 
slightly different command line args.

```bash
  ./docker-build.sh && ./docker-run.sh 
```


## Sonar

### Pro Tip: Don't do a clean, or you have to build again.

When you do a sonar build, it grabs the local build artifacts, such as the pylint report
and test coverage file, and copies it along with the code into the sonar docker container.
That container also contains a SonarScanner, which will consume those artifacts and the code
when you run it. It knows where to find that stuff via our `sonar-project.properties` file.

```bash
  ./sonar-build.sh && ./sonar-run.sh
```


### Where are my code police violations?

When you do this for the first time, before putting _your_ code in this sample project, 
you won't see any code smell, even though you can see them in the flake8 and pylint output.
That's because the default Quality Profile in sonar has those formatting problems turned off.
If you want to start turning those on, you have to log in (admin/admin) and start messing around.

This page will show you how to copy the default `C#` Quality Profile, and start customizing it.
It's the same thing for Python:

https://improveandrepeat.com/2017/12/customise-the-rules-in-sonarqube/

You can then start turning rules on and off one at a time in that profile.

If you want the full picture of stuff to clean up, you can bulk activate all the rules
in your new quality profile, and then start turning them off where they're being nit-picky.
If you do this in this empty sample project, you'll see there are a lot of code smell violations,
but turning off 2 or 3 formatting rules will take care of all of that.


### Changed the Rules and Still Didn't Show Up?

Don't forget to set your new quality profile to the default profile.

You also do that logged in as admin.

Also, after you change the rules, you have to rerun the `sonar-run.sh` script.
If you also changed your code, you should first run the build.sh script, followed by the sonar-build.sh script.

The other gotcha here, is that you have to log in (admin/admin) and 


## The Big One

If you just want to run the whole flow without typing anything, here you go:
```bash
./clean.sh && ./build.sh && ./run.sh && ./docker-build.sh && ./docker-run.sh && ./sonar-build.sh && ./sonar-run.sh
```


## Done for the Day

When you've found and fixed all the problems, why not clean up before you leave?
```bash
./clean.sh
./stop-sonar-server.sh
./stop-db.sh
```

If you were tailing those logs, you can close those too.


### Database Problems

If you have problems with the database, it is usually because you didn't wait long enough
before trying to access it.

If you did, make sure the database initialization script ran.

Look for this in the log:

```bash
test_db_1  | /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/init.sql
test_db_1  | CREATE ROLE
test_db_1  | CREATE DATABASE
test_db_1  | GRANT
```

If that broke, make sure you haven't typo-ed the local `init.sql` file,
or the local `docker/postgres/docker-compose.yaml` file where we mount
that those init statements.

If for some reason you want to run that database initialization by hand,
there's a script for that:

```bash
./setup-db.sh
``` 

The first time that init runs, it should output this:

```bash
CREATE ROLE
CREATE DATABASE
GRANT
```

If it already ran, and you run it again, it should spit out:

```bash
psql:init.sql:2: ERROR:  role "py_db_sonar_user" already exists
psql:init.sql:5: ERROR:  database "py_db_sonar" already exists
GRANT
```

### Reset The DB

If you think something went wrong with the database, you can reset it by running:

```bash
./reset-db.sh
```

This will stop the database, remove it's persistent storage, and restart it.

If it still doesn't work, run a `./clean.sh` and then try resetting it again.


### Testing With The DB

The pattern used by the build scripts is to reset the database before running the functional tests.
We also included a convenience script for rerunning the functional tests which allows
for a really tight development loop. It will drop all the database artifacts left behind
by the functional tests, and then rerun them _without_ restarting the database.

```bash
./rerun-func-tests.sh 
```

#### Note

At the end of running functional tests, our scripts leave it running, for debugging help.


### Query The DB

To login in to the database, run a:

```bash
./psql-user.sh
```

You can pass these scripts flags which then will then pass on to the system `psql`.
If you get weird problems, make sure your local `psql` is the same version (or higher)
as the one in the docker container.

You can do that like this:

```bash
# your version
#
psql --version

# docker image version
#
./psql-sudo.sh -c 'select version()'
``` 

As you will note, `psql-sudo.sh` script will access the database as the super user.
If you can't do that, the database is probably down or badly damaged. 


### DB Version

Right now, we've pinned the postgres to version 11 in the `docker/postgres/docker-compose.yaml`
because brew hasn't come out with v12 yet, even though that is the default postgres container now. 


## Scripts

#### my_project.sh
 - on a fresh checkout of this sample project, you can pass this script a new project name,
   and it will update all the hardcoded references to py_db_sonar.

#### clean.sh
 - deletes old kruft, including the test database.

#### build.sh
 - builds the code, runs the linter, and runs the tests.
   you need to do this to get a sonar report.

#### run.sh
 - runs the code. 

#### docker-build.sh
 - builds, lints, and runs the test, this time inside a new docker container.

#### docker-run.sh
 - runs that docker container.

#### sonar-build.sh
 - builds the docker container that runs the sonar coverage report, using the current regular build state.

#### sonar-run.sh
 - runs the sonar coverage report in that container.

#### start-sonar-server.sh
 - starts the sonar server. 

#### stop-sonar-server.sh
 - stops the sonar server. run this when you're done for the day.

#### start-db.sh
 - starts the postgres database that we use in the functional tests.

#### setup-db.sh
 - runs the commands in the init.sql file as the postgres super user, which creates the test user and test database.

#### reset-db.sh
 - stops the test database container, removes its persistent storage, restarts it, and then sets it up again.

#### stop-db.sh
 - stops the functional test database

#### psql-sudo.sh
 - runs the postgres command-line client as the postgres super user on the test database.

#### psql-user.sh
 - runs the postgres command-line client as the test user on the test database

#### rerun-func-tests.sh
 - drops the tables created in the functional tests and then runs the fuccitonal tests.
   if you add new tests that add new tables, add those table names to the list in this script.

## Enjoy!
