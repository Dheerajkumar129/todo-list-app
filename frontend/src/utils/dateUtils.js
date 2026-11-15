/**
 * Date and Week utilities for Frontend
 */

export function formatDateTime(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function formatShortDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function formatTime(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Format for HTML <input type="datetime-local"> (YYYY-MM-DDTHH:mm)
 */
export function toDateTimeLocalString(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) return '';

  const pad = num => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function isOverdue(dateInput, status) {
  if (status === 'Completed' || !dateInput) return false;
  return new Date(dateInput) < new Date();
}

/**
 * Priority badge styling
 */
export function getPriorityMeta(priority) {
  switch (priority) {
    case 'High':
      return {
        label: 'High',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        badge: 'text-rose-600 bg-rose-100/70'
      };
    case 'Medium':
      return {
        label: 'Medium',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        badge: 'text-amber-700 bg-amber-100/70'
      };
    case 'Low':
    default:
      return {
        label: 'Low',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        badge: 'text-emerald-700 bg-emerald-100/70'
      };
  }
}
