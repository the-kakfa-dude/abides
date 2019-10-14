from setuptools import setup, find_packages

requirements = [
    "coverage",
    "flake8",
    "pylint",
    "pytest",
    "pytest-cov"
]

setup(name="py_sonar",
      version="0.0.0",
      author="Damon Berry",
      license="LICENSE.txt",
      packages=find_packages(),
      install_requires=requirements)
