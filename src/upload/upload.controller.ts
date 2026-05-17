import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response }from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { MinioService }from 'src/minio/minio.service';

@ApiTags('Uploads')

@Controller('uploads')
export class UploadController {

  constructor(private minioService:MinioService) {}

  @Post()
  @Public()
  @ApiOperation({summary: 'Upload attachment'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({status: 201,description:'File uploaded successfully',})
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.minioService.uploadFile(file);
  }

  @Get(':fileName')
  @Public()
  @ApiOperation({ summary:'Download attachment'})
  @ApiParam({name: 'fileName'})
  async downloadFile(
    @Param('fileName')
    fileName: string,
    @Res()
    response: Response,
  ) {
    const stream =await this.minioService.getFile(fileName);
    stream.pipe(response);
  }

}