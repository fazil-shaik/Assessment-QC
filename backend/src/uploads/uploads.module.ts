import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
    controllers: [UploadsController],
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryService],
})
export class UploadsModule { }
