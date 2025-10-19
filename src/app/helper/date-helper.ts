import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToMonth',
  standalone: true
})
export class DateToMonthPipe implements PipeTransform {
  transform(dateStr: string | Date, short: boolean = true): string {
    if (!dateStr) return '';

    let date: Date;

    if (typeof dateStr === 'string') {
      // Try parsing ISO string
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) {
        // If invalid ISO, try MM/DD/YYYY
        const parts = dateStr.split('/').map(v => parseInt(v, 10));
        if (parts.length === 3) {
          const [month, day, year] = parts;
          date = new Date(year, month - 1, day);
        } else {
          return '';
        }
      } else {
        date = parsed;
      }
    } else if (dateStr instanceof Date) {
      date = dateStr;
    } else {
      return '';
    }

    const monthNamesShort = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthNamesLong = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthName = short ? monthNamesShort[date.getMonth()] : monthNamesLong[date.getMonth()];
    return `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
  }
}


export function getYearMonth(): string {
  const date = new Date(); // current date
  const year = date.getFullYear(); // 2025
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-indexed, pad with 0
  const yearMonth = `${year}-${month}`;

  return yearMonth;
}

export function getPreviousYearMonth(date: Date = new Date()): string {
  const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1); // move 1 month back
  const year = prevMonthDate.getFullYear();
  const month = (prevMonthDate.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

export function getYear(date: Date = new Date()): string {
  return `${date.getFullYear()}`;
}

export function getMonth(date: Date = new Date()): string {
  return String(date.getMonth() + 1).padStart(2, '0');
}