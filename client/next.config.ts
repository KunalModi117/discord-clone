import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jwmt3pa7br.ufs.sh",
      },
    ],
  }
};

export default nextConfig;
