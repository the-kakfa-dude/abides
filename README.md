# abides

### What

This repository contains starter projects for Java 8, Python 3,
and Typescript 3 running on Node 12.

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

Currently in (inactive) development is adding an http server to the typescript/node
project sequence (with presumably java and python to follow).


### Future Work

#### Code Generation

In a subsequent project, we may choose to have the http server expose a
REST Interface that is defined in Swagger, and appeal to some swagger-gen 
client/server generation. The idea is that if someone changes the API Interface
without updating the underlying implementation, you get compile-time failures,
for immediate alerting that something got out of sync.

This is useful for chaining together services in a multi-layer system when you have
remote developers sharing interface boundaries and sucking at communication.

Even if you eschew http services, you can still bastardize swagger-gen into an
event-driven multilayer system by harvesting the generated code (especially the
json pojos), and replacing the http calls with your producer/consumer code 
to your message bus of choice.

#### Sonar Plugin or Sonar Scanner ?

The sonar plugin for gradle is simple for default-like configurations,
but gets messy when you want to add functional tests. Using the Sonar
Scanner docker container we use in our Python projects is much cleaner,
because all you really need is the sample sonar-project.properties file
plus Building-a-docker-container 101, and the thing "just works".

We should probably choose to leave the gradle projects as they are,
and use the scanner approach in conjunction with a new set of projects
that are based on the maven build system, since it has pretty good support
for a project lifecycle that includes running integration (aka functional) tests.

### Your Feature Requests

Hello? (hello?)

Is there any body IN there?

### Cheers and Good Luck!

