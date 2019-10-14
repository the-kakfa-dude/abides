class Bike():
    """
    A pojo class for bikes.

    We exercise this class using the ORM aspects of sqlalchemy.
    """
    def __init__(self, name: str, bmx=False):
        self.name = name
        self.bmx = bmx

    def get_name(self) -> str:
        return self.name

    def is_bmx(self) -> str:
        return self.bmx

    def set_name(self, name):
        self.name = name

    def set_bmx(self, bmx):
        self.bmx = bmx
