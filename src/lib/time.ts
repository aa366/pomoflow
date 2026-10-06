export function formatDate(date: Date | number) {
  if (typeof date === "number") {
    date = new Date(date);
  }
  const formatted = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return formatted;
}
export function formatTime(date: Date | number) {
  if (typeof date === "number") {
    date = new Date(date);
  }
  const formatted = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    dayPeriod: "long",
  }).format(date);
  return formatted;
}
