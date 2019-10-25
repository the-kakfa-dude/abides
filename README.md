# abides

### What

This repository contains starter projects for Java 8 and Python 3.

The first "example" project is _extremely_ minimal, to the point where
no comments are required. That project is then extended to include other
desireable features, such quality analysis, a database, functional tests,
a web server, ....

The pattern used in these extensions is:
 - simple
 - simple + quality analysis
 - simple + qa + database
 - simple + qa + db + http server

### Work In Progress

We have a typescript project being worked on in the background.


### Future Work

#### HTTP Server

Our next Python project will extend the one with a database and
functional tests, to also include a REST server.


#### Code Generation

In a subsequent project, we may choose to define that REST Interface in Swagger,
and appeal to some code-generation so that if that if someone changes the swagger
without updating the underlying implementation, that implementation will generate
(compile time) failures, for immediate alerting that something got out of sync.
In this code generation project, we can also anticipate that certain implementation
changes might also cause immediate failures if the swagger was not also updated.

Code generation like this is a great feature to have when you have developers
sharing interface boundaries, where those developers may not be colocated,
or in other situations where you anticipate communication difficulties.


#### Sonar Plugin or Sonar Scanner

The sonar plugin for gradle is simple for default-like configurations,
but gets messy when you want to add functional tests. Using the Sonar
Scanner docker container we use in our Python projects might be cleaner.
In a future project, we will make that an evaluation. One option here 
would be to leave the gradle projects as they are, and use the scanner
approach in conjunction with a new set of projects that are based on
the maven build system.


### Your Feature Requests

The point of this repository is to help developers to hit the ground running
in a new language, especially where setting up a project with support for 
static analysis, or a database, or an http server, or ... is a big a distraction.

We want to hear from YOU about what you like, what you don't, and what's missing.

You can make your desires known by sending mail to: the dude AT kakfa dot com (no spaces)

### Cheers and Good Luck!

