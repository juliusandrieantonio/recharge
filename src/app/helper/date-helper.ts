import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToMonth',
  standalone: true
})
export class DateToMonthPipe implements PipeTransform {
  transform(dateStr: string, short: boolean = true): string {
    if (!dateStr) return '';

    // Expecting MM/DD/YYYY
    const [month, day, year] = dateStr.split('/').map(v => parseInt(v, 10));

    const monthNamesShort = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthNamesLong = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthName = short ? monthNamesShort[month - 1] : monthNamesLong[month - 1];
    return `${monthName} ${day}, ${year}`;
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