import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import config from '@/config/config.service';
import { readReplicas } from '@prisma/extension-read-replicas';

@Injectable()
export class PrismaService extends PrismaClient {
  private replicas;

  constructor() {
    super({ log: config.PRISMA_LOGLEVEL });
  }

  async onInit(): Promise<void> {
    this.replicas = this.$extends(
      readReplicas({
        url: config.POSTGRES_URL
      })
    );

    await this.$connect();
  }

  async onShutdown(): Promise<void> {
    await this.$disconnect();
  }

  get $slave(): PrismaClient {
    return this.replicas.$replica();
  }
}
