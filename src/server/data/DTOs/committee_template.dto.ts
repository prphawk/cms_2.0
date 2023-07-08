// import { PartialType } from '@nestjs/mapped-types';
// import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface CommitteeTemplateCreateDTO {
  // @IsNotEmpty()
  // @IsString()
  bond: string;

  // @IsNotEmpty()
  // @IsString()
  name: string;

  // @IsArray()
  // @IsString({ each: true })
  // @IsNotEmpty({ each: true })
  roles: string[];

  // @IsArray()
  // @IsInt({ each: true })
  committees: number[]; //TODO cria o template antes do committee, mas isso aqui passa com o array vazio?
}

//export class CommitteeTemplateUpdateDTO extends PartialType(CommitteeTemplateCreateDTO) {}
