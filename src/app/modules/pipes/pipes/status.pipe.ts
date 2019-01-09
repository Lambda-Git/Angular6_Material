import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    /*处理状态值--管道*/
    switch(value){
      case 'OPEN': return '开启';
      case 'CLOSE': return '关闭';
      case 'ON' : return '开启';
      case 'OFF' : return '关闭';
    }

  }

}
