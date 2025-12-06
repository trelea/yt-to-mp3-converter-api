import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { StorageService } from 'src/lib/storage/storage.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/db/entities/users';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly storageService: StorageService,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.retrieveTokenFromHeader(request);

    /**
     * @description If no token is provided, throw an unauthorized exception.
     */
    if (!token) throw new UnauthorizedException('No token provided');

    /**
     * @description Try to verify the token.
     */
    try {
      /**
       * @description Verify the token.
       */
      this.jwtService.verify(token);

      /**
       * @description Check if the token is blacklisted.
       */
      const blacklisted = this.storageService.get(token, '__BLACKLIST__');
      if (blacklisted) throw new UnauthorizedException('Invalid token');

      /**
       * @description Decode the token.
       */
      const user = this.jwtService.decode(token) as UserEntity;

      /**
       * @description Set the user in the request.
       */
      request.user = {
        ...user,
        token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  /**
   * @description This method is used to retrieve the token from the request.
   * @param request - The request object.
   * @returns The token.
   */
  private retrieveTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
