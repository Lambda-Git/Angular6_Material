import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    /*处理状态值--管道*/
    switch(value){
      case 1 : return '是';
      case 0 : return '否';
      case 'ADM' : return '系统管理员';
      case 'USER' : return '一般用户';
      case true : return '是';
      case false : return '否';
    }

  }

}
