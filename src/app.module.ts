import { Module } from '@nestjs/common';
import { SongsModule } from './modules/songs/songs.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { StorageService } from './lib/storage/storage.service';
import { StorageModule } from './lib/storage/storage.module';

@Module({
  imports: [
    /**
     * @description This is the configuration module for the application.
     */
    ConfigModule.forRoot({ isGlobal: true }),
    /**
     * @description This is the JWT module for the application.
     */
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
        algorithm: 'HS256',
        verifyOptions: {
          algorithms: ['HS256'],
        },
      }),
    }),
    SongsModule,
    DbModule,
    AuthModule,
    StorageModule,
  ],
  providers: [StorageService],
})
export class AppModule {}
