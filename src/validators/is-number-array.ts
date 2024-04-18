import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNumberArray', async: false })
export class IsNumberArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!(value instanceof Array)) {
      return false;
    }

    return value.every((item) => typeof item === 'number');
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each element of the array must be a number.';
  }
}

export function IsNumberArray(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNumberArrayConstraint,
    });
  };
}
