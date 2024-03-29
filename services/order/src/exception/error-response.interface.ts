import { ValidationError } from '@nestjs/common';

export type ErrorResponse = {
  status: number;
  title: string;
  detail?: any;
  source?: { pointer: string };
  children?: ValidationError[];
};
