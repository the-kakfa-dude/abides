# Example

This is a **bare bones** sample python 3 project.

Keep It Simple/Stupid.

### Make This My Own
If you want to rename this project, and all the references to the project name,
you can run this filling in the name you want for "new_name":
```bash
  ./my_project.sh new_name
```

You should *do this first*, or on a fresh checkout of this project.

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

  pylint py_example -d C0111

  pytest
```

Or for docker:

```bash
  docker build --no-cache --pull -t py_example -f docker/Dockerfile .

  docker run -t --rm py_example:latest flake8 .

  docker run -t --rm py_example:latest pylint py_example -d C0111

  docker run -t --rm py_example:latest py.test

```

### Execution

To run the py_example, run something like this:
```bash
  python -m py_example.main --make self-driving --model fantasy-land
```

To run it in the container you built ^^^ do it this way:
```bash
  docker run -t --rm py_example:latest python -m py_example.main --make self-driving --model fantasy-land
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

  rm -rf ./py_example.egg-info

  rm -rf ./.pytest_cache

  rm -rf ./tests/input_data

  find . -type f | grep pyc$ | xargs rm -f

  find . -type d | grep __pycache__ | xargs rm -rf

  docker rm $(docker ps -a | grep 'py_example:latest' | awk '{print $NF}')

  docker rmi $(docker images | tr -s ' ' | grep 'py_example latest' | cut -d' ' -f3)

  docker image prune --force
```

NOTE:  We don't attempt to delete any IDE directories like PyCharms .idea,
but we have added that one to a .gitignore, so feel free to follow that 
pattern for different IDEs. If you do, you may also want to add your dirs
to the `exclude` block in the `[flake8]` section of the `setup.cfg`. 

### Why No Comments In The Code???
If this project ever gets so non-trivial that it requires comments beyond the ones here, you should `git rm` the whole thing and start over with a better py_example.

Actually, there is one thing that needs a comment. In addtion to flake8 linting, we setup pylint, which, because we have no comments, complains about moduels not having comments. That is why when we run pylint in our scripts, we disable the rule that complains about modules not having comments:

   pylint py_example -d C0111

Enjoy!
