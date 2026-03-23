import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(4, 4)
  code: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
