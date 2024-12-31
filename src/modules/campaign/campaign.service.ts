import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '@/modules/prisma/prisma.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(
    private readonly prismaRepository: PrismaRepository
  ) {}

  async getCampaigns() {
    return this.prismaRepository.campaign.findMany();
  }
}