import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';
@Injectable()
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const authHeader = request.headers.authorization;
    const token = this.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }

    const user = this.jwtService.verify(token);

    if (!user || !user.role) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }

    return requiredRoles.some((role) => user.role.includes(role));
  }

  private extractTokenFromHeader(authHeader: string): string | undefined {
    const [type, token] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}