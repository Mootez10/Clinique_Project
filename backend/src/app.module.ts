import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CliniqueModule } from './clinique/clinique.module';
import { AgendaModule } from './agenda/agenda.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CliniqueModule,
    AgendaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
