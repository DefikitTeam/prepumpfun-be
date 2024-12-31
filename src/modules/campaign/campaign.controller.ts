import { Controller, Get } from '@nestjs/common';
import { CampaignService } from '@/modules/campaign/campaign.service';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
  ) {}

  @Get()
  async getCampaigns() {
    return this.campaignService.getCampaigns();
  }
}