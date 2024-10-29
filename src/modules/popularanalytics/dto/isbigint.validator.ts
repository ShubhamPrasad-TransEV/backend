import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBigInt(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBigInt',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Check if the value is a BigInt or can be converted to BigInt
          return typeof value === 'bigint' || (typeof value === 'string' && !isNaN(Number(value))) || (typeof value === 'number' && Number.isInteger(value));
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must be a valid BigInt or convertible to BigInt`;
        }
      },
    });
  };
}
