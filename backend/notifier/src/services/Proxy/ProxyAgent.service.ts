import { Injectable, Logger } from "@nestjs/common";
import { SocksProxyAgent } from "socks-proxy-agent";
import { default as axios } from "axios";

@Injectable()
export class ProxyAgentService {
  private readonly logger = new Logger(ProxyAgentService.name);

  // public getAxiosClient
  public async getAxiosClient() {
    const response = await axios.get(`https://api.proxyflow.io/v1/proxy/random?token=21adfd6f860e47ca5e287495&protocol=socks5`);
    const data: any = response.data;

    // Checking data
    if (data?.url) {
      const agent = new SocksProxyAgent(data.url as string);
      return axios.create({ httpsAgent: agent });
    } else {
      return axios.create();
    };
  };
};