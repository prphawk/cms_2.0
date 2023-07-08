// import { PartialType } from '@nestjs/mapped-types'
// import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface EmployeeCreateDTO {
  // @IsNotEmpty()
  // @IsString()
  name: string;

  // @IsBoolean()
  // @IsOptional()
  is_active?: boolean;
}

//export class EmployeeUpdateDTO extends PartialType(EmployeeCreateDTO) {}
