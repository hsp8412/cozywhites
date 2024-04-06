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

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = `${phoneNumber}`.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
};
