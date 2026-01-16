import dayjs from "dayjs";

export function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

/**
 * Format date to dd-mm-yyyy format
 * @param {string|Date|dayjs.Dayjs} date - Date string, Date object, or dayjs object
 * @returns {string} Formatted date string in dd-mm-yyyy format, or empty string if invalid
 */
export function formatDateToDDMMYYYY(date) {
  if (!date) return '';
  
  try {
    // Handle dayjs object
    if (dayjs.isDayjs(date)) {
      if (!date.isValid()) return '';
      return date.format('DD-MM-YYYY');
    }
    
    // Handle Date object or string
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return '';
    return dayjsDate.format('DD-MM-YYYY');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
