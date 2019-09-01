# Example

This is a **bare bones** sample python 3 project.

Keep It Simple/Stupid.

### Build and Test
To build it, lint it, and test it, do this:
```bash
  ./build.sh
```

To build, lint, and test as a docker container, do this:
```bash
  ./docker-build.sh 
```

### Manual Build and Test

If you wanted to do those things by hand, it would look something like this:

```bash
  deactivate
  rm -rf ./venv

  python3 -m venv ./venv
  . ./venv/bin/activate

  pip install -e .

  flake8

  pytest
```

Or for docker:

```bash
  docker build -t example -f docker/Dockerfile .

  docker run -t --rm example:latest flake8 .

  docker run -t --rm example:latest py.test
```

### Execution

To run the example, run something like this:
```bash
  python -m example.main --make self-driving --model fantasy-land
```

To run it in the container you built ^^^ do it this way:
```bash
  docker run -t --rm example:latest python -m example.main --make self-driving --model fantasy-land
```

Or use the helpers:
```bash
  ./run.sh
```
and
```bash
  ./docker-run.sh
```

### Cleanup

To delete the artifacts that get generated from the commands ^^^, do this:
```bash
  ./clean.sh
```

To do that by hand, try something like this:
```bash
  rm -rf ./venv

  rm -rf ./example.egg-info

  rm -rf ./.pytest_cache

  rm -rf ./tests/input_data

  find . -type f | grep pyc$ | xargs rm -f

  find . -type d | grep __pycache__ | xargs rm -rf

  docker ps -a | grep 'example:latest' | awk '{print $NF}' | xargs docker rm

  docker images | tr -s ' ' | grep 'example latest' | cut -d' ' -f3 | xargs docker rmi

  docker image prune --force
```
NOTE:  We don't attempt to delete any IDE directories like PyCharm's .idea,
but we have added that one to a .gitignore, so feel free to follow that 
pattern for different IDEs. If you do, you may also want to add your dirs
to the `exclude` block in the `[flake8]` section of the `setup.cfg`. 

### Why No Comments In The Code???
If this project ever gets so non-trivial that it requires comments beyond the ones here, you should `git rm` the whole thing and start over with a better example.

Enjoy!
