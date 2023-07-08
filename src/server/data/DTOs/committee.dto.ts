export interface CommitteeCreateDTO {
  // @IsNotEmpty()
  // @IsString()
  bond: string;

  // @IsNotEmpty()
  // @IsString()
  name: string;

  // @IsBoolean()
  // @IsOptional()
  is_active?: boolean;

  // @IsDate()
  // @IsOptional()
  // @Type(() => Date)
  begin_date?: Date;

  // @IsDate()
  // @IsOptional()
  // @Type(() => Date)
  end_date?: Date;

  // @IsString()
  // @IsOptional()
  ordinance?: string;

  // @IsString()
  // @IsOptional()
  observations?: string;

  // @IsArray()
  // @IsInt({ each: true })
  // @IsOptional()
  members?: number[];

  // @IsOptional()
  committee_template?: number;
}

// export class CommitteeUpdateDTO extends PartialType(
//    OmitType(CommitteeCreateDTO, ['members', 'committee_template'] as const),
// ) {}
