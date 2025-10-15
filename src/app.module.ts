import { Module } from "@nestjs/common";
import { FilesModule } from "./common/files/files.module";
import databaseConfig from "./database/config/database.config";
import authConfig from "./modules/user-management/auth/config/auth.config";
import appConfig from "./config/app.config";
import mailConfig from "./common/mail/config/mail.config";
import fileConfig from "./common/files/config/file.config";
import path from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HeaderResolver, I18nModule } from "nestjs-i18n";
import { TypeOrmConfigService } from "./database/typeorm-config.service";
import { MailModule } from "./common/mail/mail.module";
import { HomeModule } from "./modules/home/home.module";
import { DataSource, DataSourceOptions } from "typeorm";
import { AllConfigType } from "./config/config.type";
import { SessionModule } from "./common/session/session.module";
import { MailerModule } from "./common/mailer/mailer.module";
import { UsersManagementModule } from "./modules/user-management/user-management.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow("app.fallbackLanguage", {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, "/i18n/"), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get("app.headerLanguage", {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersManagementModule,
    FilesModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
  ],
})
export class AppModule {}
