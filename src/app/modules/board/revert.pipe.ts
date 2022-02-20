import { Pipe, PipeTransform } from '@angular/core';
import { IBoxData } from 'src/app/models/models.interfaces';

@Pipe({
  name: 'revert'
})
export class RevertPipe implements PipeTransform {

  transform(value: IBoxData[][] | null, ...args: unknown[]): IBoxData[][] {
    if (!value) {
      return []
    }

    return value.slice().reverse()
  }

}
