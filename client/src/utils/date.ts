// lib/date.ts
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export function formatDateDivider(dateStr: string): string {
  const date = dayjs(dateStr);
  if (date.isToday()) return "Today";
  if (date.isYesterday()) return "Yesterday";
  return date.format("DD MMMM YYYY");
}

export function formatMessageTime(dateStr: string): string {
  return dayjs(dateStr).format("HH:mm");
}

export function formatFullTimestamp(dateStr: string): string {
  return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
}

export function isMessageFromToday(dateStr: string): boolean {
  return dayjs(dateStr).isToday();
}
