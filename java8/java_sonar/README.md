## Java 8 Example With Gradle Build System and Quality Analysis

This is a sample project that uses the Gradle build system,
and uses a SonarQube server for Quality Analysis.

This project was written for Java 8.

The tests are all unit tests, and in the standard location.

If you don't need want quality analysis, see our sibling project `java_example`. 

If you want support for functional tests and/or a database, try `java_db_sonar`.


### Start The Sonar Server

```bash
./gradlew composeUp
```

Then go to:

  http://localhost:9000

and wait until it's done "starting up".

NOTE: failing to wait for the sonarqubue server to be ready will cause the `./gradlew sonar` task to fail.

### Clean It

A gradle clean removes the build artifacts.
I recommend you include the clean task when
you run the other tasks.

```bash
./gradlew clean
```

### Build It, Jar it, Test It, Write Report

This will compile the code, jar it up (including the uberJar),
run both the unit and functional tests while gathering code coverage data,
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

```bash
./gradlew clean run
```

### Pushing Latest Build To Sonar

```bash
./gradlew sonar
```


## Development Loop

If you want to rebuild and rerun everything from scratch, do this:

```bash
rm -rf .gradle ./build ./bin ; ./gradlew clean classes jar uberJar test testReport sonarqube run
```

When working properly, this is equivlent to a `./gradlew clean build sonar`.

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
./gradlew composeDown
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


## Enjoy!
