import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/db/entities/users';
import { hash } from 'src/utils/hash';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { StorageService } from 'src/lib/storage/storage.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly storageService: StorageService,
  ) {}
  /**
   * @description This method is used to register a new user.
   * @param registerDto - The DTO for the register endpoint.
   * @returns The registered user.
   */
  async register(registerDto: RegisterDto) {
    try {
      const user = this.userRepository.create({
        email: registerDto.email.trim(),
        password: hash(registerDto.password.trim()),
      });
      await this.userRepository.save(user);
      /**
       * @description Return a success message.
       */
      return {
        message: 'User registered successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description This method is used to login a user.
   * @param loginDto - The DTO for the login endpoint.
   * @returns The logged in user.
   */
  async login(loginDto: LoginDto, req: Request, res: Response) {
    try {
      /**
       * @description Find the user by email.
       */
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email.trim() },
      });
      /**
       * @description If the user is not found, throw an unauthorized exception.
       */
      if (!user) throw new UnauthorizedException('Invalid credentials');
      /**
       * @description If the password is not correct, throw an unauthorized exception.
       */
      if (user.password !== hash(loginDto.password.trim()))
        throw new UnauthorizedException('Invalid credentials');

      /**
       * @description Generate a JWT token.
       */
      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
      });

      /**
       * @description Set the JWT token in the storage.
       */
      this.storageService.set(
        token,
        {
          id: user.id,
          email: user.email,
        },
        '__WHITELIST__',
      );

      /**
       * @description Set the JWT token in the response header.
       */
      res.header('Authorization', `Bearer ${token}`);

      /**
       * @description Return true to indicate successful login.
       */
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @description This method is used to logout a user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns True to indicate successful logout.
   */
  async logout(req: Request, res: Response) {
    this.storageService.delete(req.user.token, '__WHITELIST__');
    this.storageService.set(req.user.token, true, '__BLACKLIST__');
    res.header('Authorization', '');
    return true;
  }
}
