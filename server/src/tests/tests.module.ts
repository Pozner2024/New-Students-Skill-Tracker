import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TestsController],
  providers: [TestsService, PrismaService],
  exports: [TestsService],
})
export class TestsModule {}
