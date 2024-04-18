import {
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNumeric', async: false })
export class IsNumericRule implements ValidatorConstraintInterface {
  validate(value: string | number) {
    return (typeof value === 'string' && !isNaN(Number(value))) || (typeof value === 'number' && !isNaN(value));
  }

  defaultMessage() {
    return 'Please enter a valid numeric value.';
  }
}

export function IsNumeric(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsNumeric',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNumericRule,
    });
  };
}
