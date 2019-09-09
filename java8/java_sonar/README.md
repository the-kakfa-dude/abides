### Starting the sonar server

```bash
gradle composeUp
```

Then go to:

  http://localhost:9000

and wait until it's done "starting up".

### Building The Code and Running The Tests

```bash
gradle clean build 
```

This ^^^ will run both the unit and functional tests.

### Getting that Data Into SonarQube

```bash
gradle clean build sonar
```

### Running the App

```bash
gradle run
```

### Cleaning up

```bash
gradle clean
rm -rf .gradle
```

### Done for the Day

You can stop your sonar server like this:
```bash
gradle composeDown
```

Enjoy!
