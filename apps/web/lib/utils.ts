export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatBashoId(id: string) {
  const year = id.slice(0, 4);
  const month = id.slice(4, 6);
  const monthNames: Record<string, string> = {
    "01": "January",
    "03": "March",
    "05": "May",
    "07": "July",
    "09": "September",
    "11": "November",
  };
  return `${monthNames[month] ?? month} ${year}`;
}

export function formatRank(rank: string | null) {
  return rank ?? "Unknown";
}
