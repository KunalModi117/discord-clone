import { fetcher } from "@discord/utils/fetcher";
import { cookies } from "next/headers";

interface Channel {
    id: string;
    name: string;
    type: string;
    serverId: string;
    createdAt: string;
  }
  
  export interface ServersData {
    id: string;
    name: string;
    ownerId: string;
    inviteCode: string;
    image?: string;
    createdAt: string;
    channels: Channel[];
  }

export const getServers =async()=>{
    const cookie = await cookies();
    const token = cookie.get("token")?.value;
    if(!token) return null;

    const response = await fetcher("/servers", {headers:{Cookie: `token=${token}`}});
    return response as ServersData[];
}