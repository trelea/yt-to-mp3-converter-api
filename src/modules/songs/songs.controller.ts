import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { Response } from 'express';

@Controller({ version: '1', path: 'songs' })
export class SongsController {
  constructor(private readonly songsService: SongsService) {}
  /**
   * @description This method is used to convert a YouTube URL to an MP3 file.
   * @param ytUrl - The YouTube URL to convert.
   * @returns The MP3 file.
   */
  @Get('download')
  async convertToMp3(
    @Query('url', {
      transform: (value: string) => {
        if (!value) throw new BadRequestException('YouTube URL is required');
        return value;
      },
    })
    url: string,
    @Res({ passthrough: false }) res: Response,
  ) {
    return await this.songsService.convertToMp3(url, res);
  }

  /**
   * @description This method is used to search for a song by name.
   * @param url - The YouTube URL to search for.
   * @returns The search results.
   */
  @Get('search')
  async search(
    @Query('url', {
      transform: (value: string) => {
        if (!value) throw new BadRequestException('YouTube URL is required');
        return value;
      },
    })
    url: string,
  ) {
    return await this.songsService.search(url);
  }
}
