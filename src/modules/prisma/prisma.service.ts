import { PrismaClient } from '@prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import { postgresConfig, prismaConfig, userConfig } from '@/config/configs';
import { readReplicas } from '@prisma/extension-read-replicas';
import { ConfigType } from '@nestjs/config';
import { hash } from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient {
  private replicas;

  constructor(
    @Inject(prismaConfig.KEY)
    private prismaConf: ConfigType<typeof prismaConfig>,
    @Inject(postgresConfig.KEY)
    private postgresConf: ConfigType<typeof postgresConfig>,
    @Inject(userConfig.KEY)
    private userConf: ConfigType<typeof userConfig>,
  ) {
    super({ log: prismaConf.logLevel });
  }

  async onInit(): Promise<void> {
    this.replicas = this.$extends(
      readReplicas({
        url: this.postgresConf.url,
      }),
    );

    await this.$connect();
    await this.seedWithDefaultUsers();
  }

  async onShutdown(): Promise<void> {
    await this.$disconnect();
  }

  get $slave(): PrismaClient {
    return this.replicas.$replica();
  }

  async seedWithDefaultUsers(): Promise<void> {
    const defaultPassHash = await hash(this.userConf.defaultUserPassword, 10);
    await this.user.upsert({
      where: { id: this.userConf.defaultUserId },
      update: {
        email: this.userConf.defaultUserEmail,
        nickname: this.userConf.defaultUserNickname,
        avatar: this.userConf.defaultUserAvatar,
        confirmed: true,
        credentials: {
          update: {
            password: defaultPassHash,
          },
        },
      },
      create: {
        id: this.userConf.defaultUserId,
        email: this.userConf.defaultUserEmail,
        nickname: this.userConf.defaultUserNickname,
        avatar: this.userConf.defaultUserAvatar,
        confirmed: true,
        credentials: {
          create: {
            password: defaultPassHash,
          },
        },
      },
    });

    const testPassHash = await hash(this.userConf.testUserPassword, 10);
    await this.user.upsert({
      where: { id: this.userConf.testUserId },
      update: {
        email: this.userConf.testUserEmail,
        nickname: this.userConf.testUserNickname,
        avatar: this.userConf.testUserAvatar,
        confirmed: true,
        credentials: {
          update: {
            password: testPassHash,
          },
        },
      },
      create: {
        id: this.userConf.testUserId,
        email: this.userConf.testUserEmail,
        nickname: this.userConf.testUserNickname,
        avatar: this.userConf.testUserAvatar,
        confirmed: true,
        credentials: {
          create: {
            password: testPassHash,
          },
        },
      },
    });
  }
}
