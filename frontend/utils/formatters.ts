import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export const formatTimeRemaining = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  if (date <= now) return "ENDED";

  const minutes = differenceInMinutes(date, now);
  const hours = differenceInHours(date, now);
  const days = differenceInDays(date, now);

  if (minutes < 1) return "Now";

  if (minutes < 60) {
    return `${minutes} Minute${minutes === 1 ? "" : "s"}`;
  }

  if (hours < 24) {
    return `${hours} Hour${hours === 1 ? "" : "s"}`;
  }

  if (days < 7) {
    return `${days} Day${days === 1 ? "" : "s"}`;
  }

  const weeks = Math.floor(days / 7);
  return `${weeks} Week${weeks === 1 ? "" : "s"}`;
};
