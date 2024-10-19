import {
  IsDefined,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 14)
  @IsLowercase()
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @IsLowercase()
  readonly firstName: string;
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @IsLowercase()
  readonly lastName: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  @IsDefined()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must contain at least 8 characters with a minimum of 1 lowercase, 1 uppercase, 1 number, and 1 symbol.',
    },
  )
  readonly password: string;
}
