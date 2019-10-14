from setuptools import setup, find_packages

requirements = [
    "coverage",
    "flake8",
    "psycopg2",
    "pylint",
    "pytest",
    "pytest-cov",
    "sqlalchemy"
]

setup(name="py_db_sonar",
      version="0.0.0",
      author="Damon Berry",
      license="LICENSE.txt",
      packages=find_packages(),
      install_requires=requirements)
