# Java 8 Example With Gradle Build System, Quality Analysis, and Database

This is a sample project that uses the Gradle build system,
and uses a SonarQube server for Quality Analysis.

It also comes with a Postgres Database and functional tests that use that db.

This project was written for Java 8.

If you don't need a database and/or functional tests, see our sibling project `py_sonar`.
If you also don't need quality analysis, the barest-bones project is `java_example`.


### Start The Sonar Server

```bash
./gradlew composeUp
```

Then go to:

  http://localhost:9000

and wait until it's done "starting up".

NOTE: failing to wait for the sonarqubue server to be ready will cause the `./gradlew sonar` task to fail.


### Clean It

```bash
./gradlew clean
```

### Build It And Run The Tests

```bash
./gradlew build
```

### Zip It Into Regular Jar and Uber Jar

The standard jar will contain only the code from this project.

An "uber" jar is a jar that has all of the project's other dependencies also zipped up in the jar files.
For example, a regular jar might not include your Google Collections guava.jar, whereas an uberJar would.

```bash
./gradlew jar uberJar
```

### Run It

```bash
./gradlew run
```

### Pushing Latest Build To Sonar

```bash
./gradlew sonar
```


## Development Loop

If you want to rebuild and rerun everything from scratch, do this:

```bash
rm -rf .gradle ./build ./bin ; ./gradlew clean build test jar uberJar funcTest run sonar
```

### But I Don't Need To Type That Much!

When your gradle tasks are only the defaults, or properly modified or extended
(like in this project) you don't really need to specify each of the tasks above,
as some will run others.

For instance, a build will do a test, a run will do build but not a jar,
and so on. The result is you end up getting some tasks for free.

However, as soon as you start adding new tasks (like a sonar task, or a task for
functional tests), or otherwise start changing the `build.gradle` file, it's pretty
easy to screw up your task dependency graph, and get weird behavior when running gradle.

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
```
rm -rf .classpath .idea .project .settings


## Rename and Repackage This Thing

If you want to take this starter project and turn it into your own project,
you can run the `my_project.sh` script. Other starter projects in this repo
will also have one of these.

*Do This First*

If you do this after changing stuff around, you'll get burned by the script.

For the `my_project.sh` in _this_ project, you pass it a new project name and
a new package name. The current project name is `java_db_sonar` and the current
java package is `com.kakfa.db`

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
and seeing if it spits out `Hello database.`


## Enjoy!
