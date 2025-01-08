import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '@/modules/prisma/prisma.repository';
import { Prisma } from '@prisma/client';
import { StringValidation } from 'zod';
import { config } from '@/config';
import { request } from 'http';

@Injectable()
export class CampaignService {
  constructor(
    private readonly prismaRepository: PrismaRepository
  ) {}

  async getCampaigns() {
    return this.prismaRepository.campaign.findMany();
  }
  
  async getCampaignStatus() {
    return this.prismaRepository.addTokenPumpProcesses.findMany();
  }

  async uploadMetadata(data: UploadMetaData) {
    // Upload image to IPFS
    const formData = new FormData();
    
    const blob = new Blob([data.file], { type: 'application/octet-stream' });
    formData.append('file', blob);

    const imageRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: config.PINATA_API_KEY,
        pinata_secret_api_key: config.PINATA_SECRET_API_KEY,
      },
      body: formData
    });

    const imageData = await imageRes.json();
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;

    // Upload metadata
    const metadata = {
      name: data.name,
      description: data.description,
      image: imageUrl
    };

    const metadataRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: config.PINATA_API_KEY,
        pinata_secret_api_key: config.PINATA_SECRET_API_KEY,
      },
      body: JSON.stringify(metadata)
    });

    const metadataData = await metadataRes.json();
    return `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`;
  }
}

type UploadMetaData = {
  file: Buffer;
  name: string;
  description: string;
}