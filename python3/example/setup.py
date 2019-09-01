from setuptools import setup, find_packages

requirements = [
    "pytest",
    "flake8",
]

setup(name="example",
      version="0.0.0",
      author="Damon Berry",
      packages=find_packages(),
      install_requires=requirements)
