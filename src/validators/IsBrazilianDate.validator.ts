import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AppService } from 'src/services/app.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsBrazilianDateValidator implements ValidatorConstraintInterface {
  constructor(private appService: AppService) {}

  async validate(value: string): Promise<boolean> {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (!dateRegex.test(value)) {
      return false;
    }

    const date = await this.appService.stringToDate(value);
    if (!date) {
      return false;
    }

    return date instanceof Date && !isNaN(date.getTime());
  }
}

export const IsBrazilianDate = (validationOptions: ValidationOptions) => {
  return (object: object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: IsBrazilianDateValidator,
    });
  };
};
