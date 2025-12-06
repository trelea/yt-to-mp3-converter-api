import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description This method is used to register a new user.
   * @param registerDto - The DTO for the register endpoint.
   * @returns The registered user.
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * @description This method is used to login a user.
   * @param loginDto - The DTO for the login endpoint.
   * @returns The logged in user.
   */
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(loginDto, req, res);
  }

  /**
   * @description This method is used to logout a user.
   * @param req - The request object.
   * @returns The logged out user.
   */
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(req, res);
  }

  /**
   * @description This method is used to get the status of the user.
   * @param req - The request object.
   * @returns The status of the user.
   */
  @UseGuards(AuthGuard)
  @Get('status')
  async status(@Req() req: Request) {
    return req.user;
  }
}
