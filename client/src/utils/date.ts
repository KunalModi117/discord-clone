import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function getRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}
