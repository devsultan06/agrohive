import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';

export class VerifyDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 4)
  code: string;

  @IsString()
  @IsOptional()
  fcmToken?: string;
}
