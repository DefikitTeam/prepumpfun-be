import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CampaignService } from '@/modules/campaign/campaign.service';
import { appendFile } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async getCampaigns() {
    const listCampaign = await this.campaignService.getCampaigns();
    return {
      data: listCampaign,
      message: 'List of campaigns',
    };
  }

  @Get('/status')
  async getCampaignStatus() {
    const listCampaignStatus = await this.campaignService.getCampaignStatus();
    return {
      data: listCampaignStatus,
      message: 'List of campaign status',
    };
  }

  @Get('/token-status')
  async getCampaignTokenStatus() {
    const listCampaignTokenStatus = await this.campaignService.getCampaignTokenStatus();
    return {
      data: listCampaignTokenStatus,
      message: 'List of campaign token status',
    };
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMetadata(@UploadedFile() file: Express.Multer.File, @Body() body: { name: string; description: string }) {
    const url = await this.campaignService.uploadMetadata({
      file: file.buffer,
      name: body.name,
      description: body.description,
    });

    return {
      data: { url },
      message: 'File uploaded successfully',
    };
  }
}
