import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestsModule } from './tests/tests.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [TestsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
