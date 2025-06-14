// utils/scheduleHelpers.js (put this wherever you keep utils)

export const getCurrentWeekDates = (today = new Date()) => {
  // Find Monday of this week
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

  // Build the week (Mon–Sun)
  const week = [];
  const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week.push({
      label: dayLabels[i],
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      fullDate: new Date(date),
      isToday: date.toDateString() === today.toDateString(),
    });
  }
  return week;
};
