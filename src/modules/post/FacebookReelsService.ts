import axios from 'axios';
import fs from 'fs';

export class FacebookReelsService {
  private pageId: string;
  private accessToken: string;
  private apiVersion = 'v21.0';

  constructor() {
    this.pageId = process.env.FB_PAGE_ID || '';
    this.accessToken = process.env.FB_ACCESS_TOKEN || '';
  }

  // 1. Initialize Session
  async initializeUpload() {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.pageId}/video_reels`;
    
    const response = await axios.post(url, {
      upload_phase: 'start'
    }, {
      params: { access_token: this.accessToken }
    });

    return {
      videoId: response.data.video_id,
      uploadUrl: response.data.upload_url
    };
  }

  // 2. Upload the Binary Data (The "Chunk")
  async uploadVideoBinary(uploadUrl: string, filePath: string) {
    const fileStream = fs.createReadStream(filePath);
    const fileSize = fs.statSync(filePath).size;

    // Send the file as a binary stream
    const response = await axios.post(uploadUrl, fileStream, {
      headers: {
        'Authorization': `OAuth ${this.accessToken}`,
        'offset': 0, // For a simple implementation, we send it all at once (chunking comes later if file > 1GB)
        'file_size': fileSize,
        'Content-Type': 'application/octet-stream'
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    return response.data;
  }

  // 3. Finish and Publish
  async finishUpload(videoId: string, description: string) {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.pageId}/video_reels`;
    
    const response = await axios.post(url, {
      upload_phase: 'finish',
      video_id: videoId,
      video_state: 'PUBLISHED',
      description: description,
    }, {
      params: { access_token: this.accessToken }
    });

    return response.data;
  }
}

export const fbReelsService = new FacebookReelsService();