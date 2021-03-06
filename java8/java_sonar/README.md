## Java 8 Example With Gradle Build System and Quality Analysis

This is a sample project that uses the Gradle build system,
and uses a SonarQube server for Quality Analysis.

This project was written for Java 8.

The tests are all unit tests, and in the standard location.

If you don't need want quality analysis, see our sibling project `java_example`. 

If you want support for functional tests and/or a database, try `java_db_sonar`.


### TL;DR

Do this in one window:

```bash
./start-sonar-server.sh; tail -F sonar.log.txt
```

When it you see the log saying something like:

```bash
sonarqube_1  | 2010.04.11 17:36:42 INFO  app[][o.s.a.SchedulerImpl] SonarQube is up
```

then you can ctrl-c it, or open a new window, and run these:

```bash
# regular build and execute
#
./gradlew clean build run
```

```bash
# push those results to sonar
#
./gradlew sonar
```

When that finishes, go here in a browser and go look at
your quality analysis reports:

  http://localhost:9000/dashboard?id=java_sonar%3Aproject


NOTE: failing to wait for the sonarqube server to be ready will cause the `./gradlew sonar` task to fail.


If you want to run the whole command pipeline from a clean slate, run this:

```bash
rm -rf .gradle ./build ./bin ; ./gradlew clean build run sonar
```


## Rename and Repackage This Thing

If you want to take this starter project and turn it into your own project,
you can run the `my_project.sh` script. Other starter projects in this repo
will also have one of these.

*Do This First*

If you do this after changing stuff around, you'll get burned by the script.

For the `my_project.sh` in _this_ project, you pass it a new project name and
a new package name. The current project name is `java_sonar` and the current
java package is `com.kakfa`

For example, if you wanted to call this project `bunnies` and you were working for
the platform team at a company called `example.com`, you would invoke the script
like this:

```bash
./my_project.sh bunnies com.example.platform
```

That will change all the names in the source files in this project,
and move the fixed up code to the new package location.

Make sure you follow the final instruction by cd-ing out of the current directory,
and then cd-ing back into the newly renamed one.

After that, you can test the result by running a `rm -rf .gradle ;  ./gradlew run`
and seeing if it spits out `Hello world.`


## Gradle Tasks

### Clean It

A gradle clean removes the build artifacts.
I recommend you include the clean task when
you run the other tasks.

```bash
./gradlew clean
```


### Build It, Jar it, Test It, Write Report

This will compile the code, jar it up (including the uberJar),
run both the unit tests while gathering code coverage data,
and then write local html reports on test execution and coverage.

```bash
./gradlew clean build
```

A test report about tests passing/failing (and why) is available at:

```bash
./build/reports/tests/test/index.html
```

A test report showing test coverage (or the lack thereof) is available at:

```bash
./build/reports/jacoco/testReport/html/index.html
```

If these break and you think it's task dependency,
a `clean build` should be equivalent to a:

```bash
./gradlew clean classes jar uberJar test testReport
```

An "uber" jar is a jar that has all of the project's other dependencies
also zipped up in the jar files. For example, a regular jar might not
include your Google Collections guava.jar, whereas an uberJar would.


### Run It

A run will do a build.

```bash
./gradlew clean run
```


### Pushing Latest Build To Sonar

A `./gradlew sonarqube` will *not* do a build or test or report or any other task.
*All* it will do is push the `testReport` data to the sonar server.

This is really only useful if you are running niche task by hand.

Note: You can type `sonar` instead of `sonarqube` if you want.

```bash
./gradlew sonar
```

For this project, the report can be found at:

  http://localhost:9000/dashboard?id=java_sonar%3Aproject


## Development Loop

If you want to rebuild and rerun everything from scratch, do this:

```bash
rm -rf .gradle ./build ./bin ; ./gradlew clean classes jar uberJar test testReport sonarqube run
```

When working properly, this is equivalent to a `./gradlew clean build sonar run`.


### But I Don't Need To Type That Much!

When your gradle tasks are only the defaults, or properly modified or extended
(like in this project) you don't really need to specify each of the tasks above,
as some will run others.

For instance, in default gradle a build will do a test, a run will do build
but not a jar, and so on. The result is you end up getting some tasks for free.

However, as soon as you start adding new tasks (like a sonar task, or an uberJar),
or otherwise start changing the `build.gradle` file, it's pretty easy to screw up
your task dependency graph, and get weird behavior when running gradle.

Gradle will protect you from creating circular dependencies, but it won't read your mind.

Thus, by specifying each of the required tasks that lead up to the final one, 
in the correct order, you are giving yourself a chance to move forward _now_,
despite having screwed up the task hierarchy.

(todo: fix the graph _later_)

;o)


## Done for the Day

You can stop your sonar server like this:
```bash
./stop-sonar-server.sh
```

Then you can remove the local build artifacts like this:
```bash
rm -rf .gradle ./build ./bin

./gradlew clean

rm -rf .gradle
```

You may also wish to nuke your IDE artifacts, by running something like:
```bash
rm -rf .classpath .idea .project .settings
```


## Enjoy!
