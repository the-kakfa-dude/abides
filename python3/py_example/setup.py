from setuptools import setup, find_packages

requirements = [
    "flake8",
    "pylint",
    "pytest"
]

setup(name="py_example",
      version="0.0.0",
      author="Damon Berry",
      packages=find_packages(),
      install_requires=requirements)
