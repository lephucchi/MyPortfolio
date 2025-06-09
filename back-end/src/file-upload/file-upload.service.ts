import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/update-file-upload.dto';

@Injectable()
export class FileUploadService {
  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not provided');
    }
    const alowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'mp4', 'video/mp4'];
    if (!alowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxFileSize) {
      throw new BadRequestException('File size exceeds the limit of 10 MB');
    }

    return {
      message: 'File uploaded successfully',
      filePath: file.path, // Assuming the file is stored in a path
    }
  }
}
