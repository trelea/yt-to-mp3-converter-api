import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * @description This is the DTO for the login endpoint.
 */
export class LoginDto {
  /**
   * @description The email address of the user.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * @description The password of the user.
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
