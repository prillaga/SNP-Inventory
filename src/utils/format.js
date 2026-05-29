export function formatPHP(value) {
  return `PHP ${Number(value).toFixed(2)}`;
}

export function formatCurrency(value) {
  return formatPHP(value);
}

export function formatTime(date = new Date()) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
