import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DbModule } from 'src/db/db.module';
import { UserEntity } from 'src/db/entities/users';

@Module({
  imports: [DbModule.forFeature([UserEntity])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
