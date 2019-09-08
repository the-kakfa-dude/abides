class Car():
    """
    A CRUD class for cars
    """
    def __init__(self, make: str, model: str):
        self._make = make
        self._model = model

    def get_make(self) -> str:
        return self._make

    def get_model(self) -> str:
        return self._model

    def set_make(self, make):
        self._make = make

    def set_model(self, model):
        self._model = model

    def drive(self):
        print(f"vroom vroom goes the {self._make} {self._model}")
