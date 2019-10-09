class Car():
    """
    A class for cars
    """
    def __init__(self, make: str, model: str):
        self.make = make
        self.model = model

    def get_make(self) -> str:
        return self.make

    def get_model(self) -> str:
        return self.model

    def set_make(self, make):
        self.make = make

    def set_model(self, model):
        self.model = model

    def drive(self):
        message = f"vroom vroom goes the {self.make} {self.model}"
        print(message)
