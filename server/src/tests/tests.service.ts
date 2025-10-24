/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestResponseDto, CreateTestDto } from './dto/test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async getTestByCodeAndVariant(
    testCode: string,
    variant: number,
  ): Promise<TestResponseDto> {
    const test = await this.prisma.tests.findFirst({
      where: {
        test_code: testCode,
        variant: variant,
      },
    });

    if (!test) {
      throw new NotFoundException(
        `Тест с кодом ${testCode} и вариантом ${variant} не найден`,
      );
    }

    return {
      id: test.id,
      testCode: test.test_code,
      testTitle: test.test_title,
      variant: test.variant,
      questions: test.questions,
      createdAt: test.created_at,
    };
  }

  async getAllTests(): Promise<TestResponseDto[]> {
    const tests = await this.prisma.tests.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    return tests.map((test) => ({
      id: test.id,
      testCode: test.test_code,
      testTitle: test.test_title,
      variant: test.variant,
      questions: test.questions,
      createdAt: test.created_at,
    }));
  }

  async getTestsByCode(testCode: string): Promise<TestResponseDto[]> {
    const tests = await this.prisma.tests.findMany({
      where: {
        test_code: testCode,
      },
      orderBy: {
        variant: 'asc',
      },
    });

    return tests.map((test) => ({
      id: test.id,
      testCode: test.test_code,
      testTitle: test.test_title,
      variant: test.variant,
      questions: test.questions,
      createdAt: test.created_at,
    }));
  }

  async createTest(createTestDto: CreateTestDto): Promise<TestResponseDto> {
    const test = await this.prisma.tests.create({
      data: {
        test_code: createTestDto.testCode,
        test_title: createTestDto.testTitle,
        variant: createTestDto.variant,
        questions: createTestDto.questions,
      },
    });

    return {
      id: test.id,
      testCode: test.test_code,
      testTitle: test.test_title,
      variant: test.variant,
      questions: test.questions,
      createdAt: test.created_at,
    };
  }

  async updateTest(
    id: number,
    updateData: Partial<CreateTestDto>,
  ): Promise<TestResponseDto> {
    const test = await this.prisma.tests.update({
      where: { id },
      data: {
        ...(updateData.testCode && { test_code: updateData.testCode }),
        ...(updateData.testTitle && { test_title: updateData.testTitle }),
        ...(updateData.variant && { variant: updateData.variant }),
        ...(updateData.questions && { questions: updateData.questions }),
      },
    });

    return {
      id: test.id,
      testCode: test.test_code,
      testTitle: test.test_title,
      variant: test.variant,
      questions: test.questions,
      createdAt: test.created_at,
    };
  }

  async deleteTest(id: number): Promise<void> {
    await this.prisma.tests.delete({
      where: { id },
    });
  }

  async getTestById(id: number): Promise<TestResponseDto> {
    const test = await this.prisma.tests.findUnique({
      where: { id },
    });

    if (!test) {
      throw new NotFoundException(`Тест с ID ${id} не найден`);
    }

    return {
      id: test.id,
      testCode: test.test_code,
      testTitle: test.test_title,
      variant: test.variant,
      questions: test.questions,
      createdAt: test.created_at,
    };
  }
}
