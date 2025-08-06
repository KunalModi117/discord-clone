import { create } from "zustand";

type Status = "online" | "offline" | "idle";

interface Member {
  id: string;
  user: {
    id: string;
    username: string;
  };
  role: string;
}

interface MemberState {
  members: Member[];
  statuses: Record<string, Status>; // userId -> status
  typingUsers: Record<string, string[]>; // channelId -> userIds[]

  setMembers: (members: Member[]) => void;
  setStatus: (userId: string, status: Status) => void;

  addTypingUser: (channelId: string, userId: string) => void;
  removeTypingUser: (channelId: string, userId: string) => void;
  resetTypingUsers: (channelId: string) => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  members: [],
  statuses: {},
  typingUsers: {},

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
}));
