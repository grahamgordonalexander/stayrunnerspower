import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        uri: 'mongodb+srv://macarsalan:wtpnrs5kzpeb0oio@cluster0.mwpbbxv.mongodb.net/LMB?retryWrites=true&w=majority&appName=Cluster0',
        // uri: 'mongodb+srv://macarsalan:wtpNrs5KZPEB0OIO@cluster0.mwpbbxv.mongodb.net/LMB?retryWrites=true&w=majority&appName=Cluster0',
        connectionFactory: (connection) => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          connection.plugin(require('mongoose-autopopulate'));
          //  console.log("database successfully connected!!",connection);
          // console.log(connection);

          console.log('database connection successfully done....!');
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongooseOmModule {
  cons;

}
