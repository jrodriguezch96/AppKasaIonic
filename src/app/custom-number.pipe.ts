import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customNumber',
  standalone: true
})
export class CustomNumberPipe implements PipeTransform {

  transform(value: number, digitsInfo: string = '1.0-3'): string {
    // Utilizar el pipe number para formatear el número
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumIntegerDigits: 1,
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    }).format(value);

    // Reemplazar el punto decimal con una coma
    return formattedNumber.replace('.', ',');
  }

}
