import { Response } from 'express';
export declare class UploadsController {
    uploadFile(file: Express.Multer.File): {
        url: string;
        filename: string;
    };
    serveFile(filename: string, res: Response): void;
}
