import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fontSize'
})
export class FontSizePipe implements PipeTransform {

  transform(value: number, divisor: number): string {
    return `${Math.floor(value / (divisor || 48))}px`;
  }

}
