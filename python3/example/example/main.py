import argparse

from example import car


def parseargs() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--make", help="the make of the car")
    parser.add_argument("--model", help="the model of the car")
    args = parser.parse_args()
    return args


def main():

    args = parseargs()

    if args.make:
        make = args.make
    else:
        make = "tesla"

    if args.model:
        model = args.model
    else:
        model = "expensive"

    new_car = car.Car(make, model)
    new_car.drive()


if __name__ == '__main__':
    main()
