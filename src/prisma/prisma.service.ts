import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Ensure correct import of PrismaClient

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  [x: string]: any;
  updatePassword: any;
  findByEmail: any;
  saveResetToken: any;
  findByResetToken: any;
  clearResetToken: any;
  customPasswordReset: any;
  private _store: any;
  public get store(): any {
    return this._store;
  }
  public set store(value: any) {
    this._store = value;
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
