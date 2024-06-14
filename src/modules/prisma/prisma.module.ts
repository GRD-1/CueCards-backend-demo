import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PrismaService,
  ],
  exports: [PrismaService],
})
export class PrismaModule {
  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.prismaService.onInit();
  }

  async beforeApplicationShutdown(): Promise<void> {
    await this.prismaService.onShutdown();
  }
}
