# Java 8 Example With Gradle Build System

This is a sample project that uses the Gradle build system.

This project was written for Java 8.

The tests are all unit tests, and in the standard location.

If you want functional tests and quality analysis, see our sibling project `java_sonar`. 

### Clean It

```bash
./gradlew clean
```

### Build It And Run The Tests

```bash
./gradlew build 
```

### Zip It Into A Jar File 

```bash
./gradlew jar
```

### Run It

```bash
./gradlew run
```

## Development Loop

If you want to rebuild and rerun everything from scratch, do this:

```bash
rm -rf .gradle ./build ./bin ; ./gradlew clean build test jar run
```

### But I Don't Need To Type That Much!
When your gradle tasks are default (like in this project),
or properly modified or extended (like hopefully our other projects)
you don't really need to specify each of the tasks above, as some
will run others.

For instance, a build with do a test, a run will do build but not a jar,
and so on. The result is you end up getting some taks for free.

However, as soon as you start adding new tasks, or otherwise changing the
`build.gradle` file, it's pretty easy to screw up your task dependency graph,
and get weird behavior when running gradle tasks.

By specifying each of the required tasks that lead up to a run, in order,
you are giving yourself a chance to move forward _now_, despite having
screwed up the task hierarchy.

(todo: fix the graph _later_)

;o)

## Rename and Repackage This Thing

If you want to take this starter project and turn it into your own project,
you can run the `my_project.sh` script. Other starter projects in this repo
will also have one of these.

For the `my_project.sh` in _this_ project, you pass it a new project name and
a new package name. The current project namem is `java_example` and the current
java package is `com.kakfa`

For example, if you wanted to call this project `foobar` and you were working for
the commerce team at a company called `example.com`, you would invoke the script
like this:

```bash
./my_project.sh foobar com.example.commerce
```

That will change all the names in the source files in this project,
and move the fixed up code to the new package location.

You can test the result by running a `./gradlew run` and seeing if it spits out `Hello world.`


## Enjoy!
