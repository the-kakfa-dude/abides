class Car():
    """
    A pojo class for cars.

    We exercise this class using the non-ORM aspects of sqlalchemy.
    """
    def __init__(self, make: str, model: str, junker=False):
        self.make = make
        self.model = model
        self.junker = junker

    def get_make(self) -> str:
        return self.make

    def get_model(self) -> str:
        return self.model

    def is_junker(self) -> str:
        return self.junker

    def set_make(self, make):
        self.make = make

    def set_model(self, model):
        self.model = model

    def set_junker(self, junker):
        self.junker = junker

    def drive(self):
        message = f'vroom vroom goes the {self.make} {self.model}'
        if self.junker:
            message += '. screeeeeeetch.... BOOM!!!'
        print(message)
        return message
