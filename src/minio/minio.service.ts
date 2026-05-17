import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import * as Minio from 'minio';

@Injectable()
export class MinioService {

    private client: Minio.Client;

    private bucketName = 'attachments';

    constructor() {

        this.client = new Minio.Client({
            endPoint: 'localhost',
            port: 9000,
            useSSL: false,
            accessKey: 'admin',
            secretKey: 'password123',
        });
    }

    async uploadFile(file: Express.Multer.File) {

        const fileName =`${Date.now()}-${file.originalname}`;

        await this.client.putObject(
            this.bucketName,
            fileName,
            file.buffer,
            file.size,
            {
                'Content-Type':
                    file.mimetype,
            },
        );

        return {
            fileName,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `http://localhost:9000/${this.bucketName}/${fileName}`,
        };
    }

    async getFile(fileName: string) {

        const exists = await this.client.statObject(
            this.bucketName,
            fileName,
        )
            .catch(() => null);

        if (!exists) {
            throw new NotFoundException('File not found');
        }

        return this.client.getObject(this.bucketName, fileName);
    }
}