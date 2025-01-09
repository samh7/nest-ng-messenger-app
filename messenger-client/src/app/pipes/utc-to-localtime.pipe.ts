import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToLocalTime'
})
export class UtcToLocalTimePipe implements PipeTransform {

  transform(dateString: string): string {
    try {
      if (!dateString) {
        return '';
      }

      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      const formattedTime = `${hours}.${minutes.toString().padStart(2, '0')} ${ampm}`;
      return formattedTime;
    } catch (error) {
      console.error('Error converting date:', error);
      return 'Error converting date';
    }
  }

}
