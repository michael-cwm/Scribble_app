export function timeFormatter(time) {
  //   const timeInMinutes = Math.floor((Date.now() - +scribble?.time) / 60000);
  const timeInMinutes = Math.floor((Date.now() - +time) / 60000);

  let timeLabel = `${timeInMinutes}m ago`;
  if (timeInMinutes > 60) {
    const timeInHours = Math.floor(timeInMinutes / 60);
    timeLabel = `${timeInHours}h ago`;
  }

  return timeLabel;
}
