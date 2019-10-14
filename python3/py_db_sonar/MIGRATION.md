## Monkeying the projects

These are the steps to take my recently developed python3 shell project (with sonar support) that's on github, and pull in a fictitious `finish_me` take-home exam from a fictitious company named Acme.


### Nuking Docker

DO NOT DO THIS unless, like me, you like dropping a bomb on your system and starting from scratch.

```bash
# docker system prune -af && docker volume prune -f
```


### Clone my code

```bash
mkdir temp
cd temp

git clone git@github.com:the-kakfa-dude/abides

mkdir workdir

rsync -avPr ./abides/python3/py_db_sonar ./workdir/
```


### Pull in their code

```bash
rsync -avPr ~/projects/acme ./workdir/
```


### Skin the shell project for this new project

```bash
cd workdir

mv py_db_sonar acme_py_db_sonar

cd acme_py_db_sonar/

./my_project.sh acme_py_db_sonar
```


### See if it still works

```bash
./clean.sh && ./build.sh && ./run.sh 

./docker-build.sh && ./docker-run.sh 
```


### Start sonar

```bash
./start-sonar-server.sh ; tail -F sonar.log.txt
```

Wait for it to tell you "SonarQube is up".


### Run a sonar report

If you cleaned after you smoke tested above, rebuild.

```bash
./clean.sh && ./build.sh
```

And then generate the sonar report:

```bash
./sonar-build.sh && ./sonar-run.sh 
```


### Look at sonar

Go to the project page on localhost:9000 for this project skin:

http://localhost:9000/dashboard?id=acme_py_db_sonar%3Aproject

#### NOTE

My shell project has no "Code Smell" under the default quality profile for python, despite the various pylint complaints. What to look for in sonar at this point is the test coverage, which should be quite poor, since there's a `main.py` entrypoint that parses args (which is verbose), but there are no functional tests covering it.

To see the pylint complaints from the build script in sonar, you have to log in as admin/admin, copy the default python quality profile, set it as default, and then enable some of the rules you see being violated. What I do is just enable them all, then turn off the noisy ones (like missing pydoc, comment percentage too low, etc).

Once you have some funky rule changes, all you have to do is rerun the same sonar scanner you built before:

```bash
./sonar-run.sh 
```


### Nuke the shell project code

```bash
rm -rf ./acme_py_db_sonar/*

rm -rf ./tests/*

rm -rf ./functional_tests/*
```


### Pull in the Acme code

In this example, we assume that the `finish_me` project has some database files, some shells scripts, and some stuff related to a variant called `alt_finish_me.sh` that we want to get rid of.

We're also assuming they put their tests next to their source, as opposed to where we put it, which is next to the project source directory `acme_py_db_sonar`. If this is your case aswell take my advice, **trust me**, move their tests into our test directory.

Lastly, we use a setup.py, but let's assume the other project just had a requirements.txt.

```bash
rsync -avPr ~/projects/acme/*.sh ./

rsync -avPr ~/projects/acme/finish_me/*.py ./acme_py_db_sonar/

rsync -avPr ~/projects/acme/finish_me/*.sql ./acme_py_db_sonar/

rm ./alt_finish_me_script.sh

rsync -avPr ~/projects/acme/README.md ./Acme.README.md

rsync -avPr ~/projects/acme/requirements.txt ./acme.requirements.txt

# you _really_ want to move their tests into where we expect to find them.
#
rsync -avPr ~/projects/acme/finish_me/tests/* ./tests/

rsync -avPr ~/projects/acme/finish_me/functional_tests/* ./functional_tests/
```


### Reminder that our run scripts need love
When you are porting someone elses code, you are about 99% sure you don't run it like we ran our starter project code.

```bash
truncate -s 0 run.sh
echo '#!/usr/bin/env bash' >> run.sh
echo "echo 'IMPLEMENT ME'" >> run.sh

truncate -s 0 docker-run.sh
echo '#!/usr/bin/env bash' >> docker-run.sh
echo 'docker run -t --rm acme_py_db_sonar:latest ./run.sh' >> docker-run.sh
```


### clean up
```bash
./clean.sh
```

### Skin the Acme code

We need to rename the internal "finish_me" references in their code to our new project name: `acme_py_db_sonar`

**You might want to backup at this point.**

Note: Because `sed -i` is broken on vanilla OS X, we pipe the code through `sed` to a temp file, remove the original, and then rename the temp file back. The drawback is we lose the executable bit on the shell scripts, so we have to add those back manually.

```bash
for file in $(grep -R finish_me . | grep -v Binary | cut -d':' -f1 | sort | uniq); do echo $file; cat $file | sed 's/finish_me/acme_py_db_sonar/g' > ${file}.fixed && rm $file && mv ${file}.fixed $file; done

chmod +x *.sh

```

#### Output should look something like this:

```bash
./Acme.README.md
./some_script.sh
./acme_py_db_sonar/__init__.py
./run_finish_me.sh
./tests/conftest.py
```

#### NOTE

The sed in the readme change now assumes the script name for running the server has changed. Make it so:

```bash
mv ./run_finish_me.sh run_acme_py_db_sonar.sh
```


### Smoke test it -- build

```bash
./build.sh
```

#### It broke

Let's assume that the other project has some dependencies that our project doesn't, and since our `setup.py` won't have them, the build should break.

Let's say that dependency is the "Flask" server. We can add it in a one-liner like this:

```bash
cat setup.py | sed 's/]/,"Flask"]/g' > setup.py.fixed && rm setup.py && mv setup.py.fixed setup.py
```


### Try again

```bash
./clean.sh && ./build.sh 
```

You should get output from linters and the tests should pass.


### Server test

Hopefully the tests exercise everything you need for the regular code to run, and there are no more missing dependencies. However, a good old fashioned smoke test where your start up the server and hit an endpoint or two can't hurt.

Peek in the Acme readme to see how to start and test the server.


```bash
. ./venv/bin/activate
./run_acme_py_db_sonar.sh 
```


### Smoke test the server

Let's say the other project's server has a health-check endpoint `/status`.

Go to http://localhost:8888/status in your browser, or in another window, do this:

```bash
curl http://localhost:8888/status
```

### Exit the server

Hit ctrl-c in the window where you ran the server


### Rinse, Lather, Repeat

Run a full clean, build, docker build, sonar build and sonar scan, examine the report on the new quality profile that complains about everything, and call it a day

```bash
./clean.sh && ./build.sh && ./run.sh && ./docker-build.sh && ./docker-run.sh && ./sonar-build.sh && ./sonar-run.sh 
```

### Done for the day

You can now stop your sonar server. Don't worry, all the data will still be there when you start it back up again (assuming you don't nuke your docker volumes again).

```bash
./stop-sonar-server.sh
```

You might also want to shut down your test database.

The data in it will persist across restarts, but when our scripts run functional tests, they recreate the database first.
```bash
./stop-db.sh
```

