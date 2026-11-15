/**
 * Week Utilities for To-Do List Application
 * Requirements:
 * - Weekly Organization: Tasks grouped and displayed by week.
 * - Weeks will start on Monday and end on Sunday.
 */

function getWeekRange(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  // day of week: 0 = Sun, 1 = Mon, ..., 6 = Sat
  const day = date.getDay();
  // distance from Monday:
  // If Sunday (0), Monday was 6 days ago (-6)
  // If Monday (1), 0
  // If Tuesday (2), -1
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Local date part as unique week ID (e.g. 2024-10-14)
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const dStr = String(monday.getDate()).padStart(2, '0');
  const weekId = `${y}-${m}-${dStr}`;

  return {
    weekId,
    startDate: monday,
    endDate: sunday
  };
}

function formatWeekLabel(startDate, endDate) {
  const optionsShort = { month: 'short', day: 'numeric' };
  const optionsWithYear = { month: 'short', day: 'numeric', year: 'numeric' };

  const startStr = startDate.toLocaleDateString('en-US', optionsShort);
  const endStr = endDate.toLocaleDateString('en-US', optionsWithYear);

  return `${startStr} – ${endStr}`;
}

/**
 * Group an array of task objects by week (Monday - Sunday)
 */
function groupTasksByWeek(tasks) {
  const weeksMap = new Map();

  // Determine current week range
  const now = new Date();
  const currentWeekInfo = getWeekRange(now);
  const currentWeekId = currentWeekInfo.weekId;

  for (const task of tasks) {
    const taskDate = new Date(task.dateTime);
    const { weekId, startDate, endDate } = getWeekRange(taskDate);

    if (!weeksMap.has(weekId)) {
      weeksMap.set(weekId, {
        weekId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        label: formatWeekLabel(startDate, endDate),
        isCurrentWeek: weekId === currentWeekId,
        openTasksCount: 0,
        completedTasksCount: 0,
        totalTasksCount: 0,
        tasks: []
      });
    }

    const weekGroup = weeksMap.get(weekId);
    weekGroup.tasks.push(task);
    weekGroup.totalTasksCount += 1;

    if (task.status === 'Completed') {
      weekGroup.completedTasksCount += 1;
    } else {
      weekGroup.openTasksCount += 1;
    }
  }

  // If current week has no tasks yet, optionally include it so user can see "This Week"
  if (!weeksMap.has(currentWeekId)) {
    weeksMap.set(currentWeekId, {
      weekId: currentWeekId,
      startDate: currentWeekInfo.startDate.toISOString(),
      endDate: currentWeekInfo.endDate.toISOString(),
      label: formatWeekLabel(currentWeekInfo.startDate, currentWeekInfo.endDate),
      isCurrentWeek: true,
      openTasksCount: 0,
      completedTasksCount: 0,
      totalTasksCount: 0,
      tasks: []
    });
  }

  // Sort weeks chronologically
  const sortedWeeks = Array.from(weeksMap.values()).sort((a, b) =>
    a.weekId.localeCompare(b.weekId)
  );

  // Sort tasks within each week by dateTime
  for (const week of sortedWeeks) {
    week.tasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }

  return sortedWeeks;
}

module.exports = {
  getWeekRange,
  formatWeekLabel,
  groupTasksByWeek
};
