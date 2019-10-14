import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from py_db_sonar import DB_ENGINE

BASE = declarative_base()
INIT = False


class BikesTable(BASE):
    """
    This is an ORM Class for the bikes table, using SQL Alchemy as the ORM provider.
    """
    # this is the name of the table
    __tablename__ = 'bikes'

    # these are the columns
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)  # we get serial key for free here
    name = sqlalchemy.Column(sqlalchemy.String)
    bmx = sqlalchemy.Column(sqlalchemy.Boolean, default=False)

    def __repr__(self):
        return f'{self.__tablename__}({self.id}, {self.name}, {self.bmx})'

    def __str__(self):
        return self.__repr__()


if not INIT:
    INIT = True
    BASE.metadata.create_all(bind=DB_ENGINE)
