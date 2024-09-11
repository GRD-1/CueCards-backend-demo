import { PrismaClient } from '@prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import { postgresConfig, prismaConfig } from '@/config/configs';
import { readReplicas } from '@prisma/extension-read-replicas';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  private replicas;

  constructor(
    @Inject(prismaConfig.KEY)
    private prismaConf: ConfigType<typeof prismaConfig>,
    @Inject(postgresConfig.KEY)
    private postgresConf: ConfigType<typeof postgresConfig>,
  ) {
    super({ log: prismaConf.logLevel });
  }

  async onInit(): Promise<void> {
    this.replicas = this.$extends(
      readReplicas({
        url: this.postgresConf.url!,
      }),
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
