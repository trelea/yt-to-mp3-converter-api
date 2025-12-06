import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { spawn } from 'child_process';

@Injectable()
export class SongsService {
  /**
   * @description This method is used to convert a YouTube URL to an MP3 file.
   * @param url - The YouTube URL to convert.
   * @param res - The response object to stream the audio to.
   */
  async convertToMp3(url: string, res: Response) {
    const ytUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!ytUrlRegex.test(url))
      throw new BadRequestException('Invalid YouTube URL');

    /**
     * @description Get the title of the video. & set the content type and disposition headers.
     */
    const title = await this.getVideoTitle(url);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);

    const ytdlp = spawn('yt-dlp', ['-f', 'bestaudio', '-o', '-', url]);

    const ffmpeg = spawn('ffmpeg', [
      '-i',
      'pipe:0',
      '-f',
      'mp3',
      '-ab',
      '320k',
      'pipe:1',
    ]);

    /**
     * @description Pipe the ytdlp stdout to the ffmpeg stdin and the ffmpeg stdout to the response.
     */
    ytdlp.stdout.pipe(ffmpeg.stdin);
    ffmpeg.stdout.pipe(res);

    /**
     * @description Pipe the ytdlp stderr to the console and the ffmpeg stderr to the console.
     */
    ytdlp.stderr.on('data', (data) => {});
    ffmpeg.stderr.on('data', (data) => {});

    /**
     * @description If the ytdlp or ffmpeg process errors, throw an internal server error exception.
     */
    ytdlp.on('error', (err) => {
      console.error('yt-dlp error:', err);
      if (!res.headersSent)
        throw new InternalServerErrorException('Failed to download audio');
    });

    /**
     * @description If the ffmpeg process errors, throw an internal server error exception.
     */
    ffmpeg.on('error', (err) => {
      console.error('ffmpeg error:', err);
      if (!res.headersSent)
        throw new InternalServerErrorException('Failed to convert audio');
    });
  }

  /**
   * @description This method is used to get all details about a YouTube video.
   * @param url - The YouTube URL to get details of.
   * @returns The video details.
   */
  async search(url: string): Promise<unknown> {
    /**
     * @description Validate the YouTube URL.
     */
    const ytUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!ytUrlRegex.test(url))
      throw new BadRequestException('Invalid YouTube URL');

    /**
     * @description Get the video details.
     */
    return new Promise((resolve, reject) => {
      const ytdlp = spawn('yt-dlp', ['--dump-json', '--no-download', url]);
      let data = '';

      /**
       * @description Pipe the ytdlp stdout to the data variable.
       */
      ytdlp.stdout.on('data', (chunk) => {
        data += chunk.toString();
      });

      /**
       * @description If the ytdlp process closes, parse the data and return the video details.
       */
      ytdlp.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(
              new InternalServerErrorException('Failed to parse video info'),
            );
          }
        } else {
          reject(new BadRequestException('Failed to get video info'));
        }
      });

      /**
       * @description If the ytdlp process errors, throw an internal server error exception.
       */
      ytdlp.on('error', () => {
        reject(new InternalServerErrorException('yt-dlp not found'));
      });
    });
  }

  /**
   * @description This method is used to get the title of a YouTube video.
   * @param url - The YouTube URL to get the title of.
   * @returns The title of the YouTube video.
   */
  private async getVideoTitle(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const ytdlp = spawn('yt-dlp', ['--get-title', url]);
      let title = '';

      ytdlp.stdout.on('data', (data) => {
        title += data.toString();
      });

      ytdlp.on('close', (code) => {
        if (code === 0) {
          resolve(title.trim().replace(/[^\w\s-]/g, '') || 'audio');
        } else {
          reject(new BadRequestException('Failed to get video info'));
        }
      });

      ytdlp.on('error', () => {
        reject(new BadRequestException('yt-dlp not found'));
      });
    });
  }
}
