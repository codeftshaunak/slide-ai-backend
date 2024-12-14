import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
// import { AuthModule } from './cofounders-lab/auth/auth.module';
// import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { BullModule } from '@nestjs/bull';
import { UserInterceptor } from './common/interceptor/user-context.interceptor';
import { AIIntegrationModule } from './modules/replicate/ai-integration.module';


// mongoose.set('debug',true)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_URL');
        Logger.log(`Connecting to MongoDB at ${uri}`, 'MongoDBConnection');
        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              Logger.log('MongoDB connected successfully', 'MongoDBConnection');
            });
            connection.on('error', (err) => {
              Logger.error(
                `MongoDB connection error: ${err.message}`,
                '',
                'MongoDBConnection',
              );
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],

    }),

    // MongooseModule.forFeature([
    //   { name: UploadFile.name, schema: UploadFileSchema },
    // ]),


    // Other Modules
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'tmp'), // Relative path to 'uploads'
      serveRoot: '/tmp', // URL prefix to serve files
    }),
    AIIntegrationModule,
   
    // Configure BullMQ without Redis settings (let it use REDIS_CLIENT from RedisModule)
   
    // BullModule.forRoot({
    //   redis: {
    //     host: process.env.REDIS_HOST, // Ensure this matches your Redis host
    //     port: Number(process.env.REDIS_PORT), // Ensure this matches your Redis port
    //   },
    // }),


    BullModule.registerQueue({
      name: 'videoOptimization',
    }),

    BullModule.registerQueue({
      name: 'mediaOptimization', // Register the mediaOptimization queue
    }),

  ],
  providers: [
    // S3Service,

    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },


  ],
})
export class AppModule { }
