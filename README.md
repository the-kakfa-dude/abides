

# abides

### What Lies Within

In this repo, you will find starter projects in various languages.

In each language, the "example" project is _extremely_ minimal, to the point where (almost) no comments are required.

This example project is then extended to include other aspects you would want in a starter project, such as static analysis via SonarQube, a database, a REST server, functional tests to supplement the unit tests, and so on.

### Work In Progress

We have a typescript project being worked on in the background.

### Future Work

#### HTTP Server
After just adding python starter project with a database and functional tests, we will next add a REST server.

#### Code Generation
In a subsequent project, we may choose to define that API Interface in Swagger, and appeal to some code-generation so that if that if someone changes the swagger without updating the underlying implementation, that implementation will generate (compile time) failures, for immediate alerting that something got out of sync. In the code generation project, we can also anticipate that certain implementation changes might also cause compile-time failures if the swagger was not also updated.

Code generation like this is a great feature to have when you have developers sharing interface boundaries, where those developers may not be colocated, or for other situations which anticipate communication difficulties among developers.

#### Sonar Plugin or Sonar Scanner
When we added sonar support to the `java_sonar` starter project, because we wanted to demonstrate functional test support, the sonar-related changes in `build.gradle` got a bit messy. Later when we added sonar-scanner-via-docker to get sonar working with our python projects, we got some _very_ clean code. 

A future project will be take to revisit `java_sonar`, and see if we can get cleaner functional test support by appealing the same sonar-scanner docker approachinstead of the gradle plugin for sonar.

### Your Feature Requests
The point of this project is to allow developers to hit the ground running in a new language, or for whom setting up a project with multifaceted support for things like static analysis, databases, http servers and the like would just be a distraction that slows you down from just writing the code.

As a result, we want to hear from YOU about what is good in here, what is bad in here, and what you want to see changed or added next. You can make your desires known by sending mail to: the dude AT kakfa dot com (no spaces)

Cheers and Good Luck!

