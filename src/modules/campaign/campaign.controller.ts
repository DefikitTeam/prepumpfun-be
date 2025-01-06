import { Controller, Get } from '@nestjs/common';
import { CampaignService } from '@/modules/campaign/campaign.service';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
  ) {}

  @Get()
  async getCampaigns() {
    const listCampaign = await this.campaignService.getCampaigns();
    return {
      data: listCampaign,
      message: 'List of campaigns',
    }
  }

  @Get('/status')
  async getCampaignStatus() {
    const listCampaignStatus = await this.campaignService.getCampaignStatus();
    return {
      data: listCampaignStatus,
      message: 'List of campaign status',
    }
  }
}