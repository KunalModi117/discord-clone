import { create } from "zustand";

type Status = "online" | "offline"

interface Member {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  role: string;
}

interface MemberState {
  members: Member[];
  statuses: Record<string, Status>; // userId -> status
  typingUsers: Record<string, string[]>; // channelId -> userIds[]
  activeServerId: string | null;
  activeChannelId: string | null;

  setMembers: (members: Member[]) => void;
  setStatus: (userId: string, status: Status) => void; // This is the key method for status updates
  setActiveServerId: (serverId: string | null) => void;
  setActiveChannelId: (channelId: string | null) => void;

  addTypingUser: (channelId: string, userId: string) => void;
  removeTypingUser: (channelId: string, userId: string) => void;
  resetTypingUsers: (channelId: string) => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  members: [],
  statuses: {},
  typingUsers: {},
  activeServerId: null,
  activeChannelId: null,

  setMembers: (members) => set({ members }),

  setStatus: (userId, status) =>
    set((state) => ({
      statuses: { ...state.statuses, [userId]: status },
    })),

  addTypingUser: (channelId, userId) =>
    set((state) => {
      const users = new Set(state.typingUsers[channelId] || []);
      users.add(userId);
      return {
        typingUsers: {
          ...state.typingUsers,
          [channelId]: Array.from(users),
        },
      };
    }),

  removeTypingUser: (channelId, userId) =>
    set((state) => {
      const users = new Set(state.typingUsers[channelId] || []);
      users.delete(userId);
      return {
        typingUsers: {
          ...state.typingUsers,
          [channelId]: Array.from(users),
        },
      };
    }),

  resetTypingUsers: (channelId) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [channelId]: [] },
    })),

  setActiveServerId: (serverId) => set({ activeServerId: serverId }),
  setActiveChannelId: (channelId) => set({ activeChannelId: channelId }),
}));
