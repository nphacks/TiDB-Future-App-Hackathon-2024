// date-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | null | undefined, format: string = 'short'): string {
    if (!value) return ''; // Handle null or undefined values

    const date = new Date(value);
    
    // Check for invalid date
    if (isNaN(date.getTime())) return 'Invalid date';

    // Format options
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
