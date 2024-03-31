export function formatDateTime(dateTime: Date) {
  const formatted = `${dateTime.toLocaleString("default", {
    month: "long",
  })} ${dateTime.getDate()}, ${
    dateTime.getHours() % 12 === 0 ? 12 : dateTime.getHours() % 12
  }:${dateTime.getMinutes() < 10 ? "0" : ""}${dateTime.getMinutes()} ${
    dateTime.getHours() >= 12 ? "PM" : "AM"
  }`;

  return formatted;
}
