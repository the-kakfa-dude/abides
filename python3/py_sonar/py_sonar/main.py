import argparse

from py_sonar.car import Car


def parseargs() -> argparse.Namespace:
    """
    Sets up our command line interface.

    :return: The standard args parser.
    """

    parser = argparse.ArgumentParser()
    parser.add_argument("--make",
                        dest='make',
                        type=str,
                        default=None,
                        help="the make of the car")
    parser.add_argument("--model",
                        dest='model',
                        type=str,
                        default=None,
                        help="the model of the car")

    return parser.parse_args()


def args_to_car(car_args) -> Car:
    """
    Takes the presented car args and returns a car object that represents it.

    :param car_args: Our argsparse object, or a Car (which has the same signature).

    :return: A car matching the presented args.
             If you actually pass me a Car instace, we return a new one.
    """

    if car_args.make:
        make = car_args.make
    else:
        make = "tesla"

    if car_args.model:
        model = car_args.model
    else:
        model = "expensive"

    car = Car(make, model)
    return car


def main():
    """
    Parses the command-line arguments, turns them into a car, and takes it for a drive.

    :return: This method does not return a value.
    """

    args = parseargs()
    car = args_to_car(args)
    car.drive()


if __name__ == '__main__':
    main()
