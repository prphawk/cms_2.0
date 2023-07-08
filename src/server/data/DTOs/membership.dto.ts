export interface MembershipCreateDTO {
  // @IsString()
  // @IsOptional()
  role?: string;

  // @IsDate()
  // @IsOptional()
  // @Type(() => Date)
  begin_date?: Date;

  // @Min(1)
  // @Max(100)
  // @IsInt()
  // @IsOptional()
  term?: number;

  // @IsString()
  // @IsOptional()
  observations?: string;

  // @IsBoolean()
  // @IsOptional()
  is_active?: boolean;
}

export interface MembershipUniqueDTO {
  // @IsNotEmpty()
  // @IsInt()
  employee_id: number;
  //  @IsNotEmpty()
  //  @IsInt()
  committee_id: number;
}

//export class MembershipUpdateDTO extends PartialType(MembershipCreateDTO) {}
