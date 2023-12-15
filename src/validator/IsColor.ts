import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isHexColor,
  isRgbColor,
} from 'class-validator';

@ValidatorConstraint({ name: 'isColor' })
export class IsColor implements ValidatorConstraintInterface {
  validate(
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    return isHexColor(value) || isRgbColor(value);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.value} is not a color`;
  }
}
