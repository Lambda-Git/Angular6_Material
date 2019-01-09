import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'app-overview-chart1',
  templateUrl: './overview-chart1.component.html',
  styleUrls: ['./overview-chart1.component.css']
})
export class OverviewChart1Component implements OnInit {
  options: any;
  updateOptions: any;
  curValue: any;

  private data: any;
  private timer: any;

  constructor(
    private _config: ConfigService,
  ) { }

  ngOnInit() {
    // 初始化数据赋值
    this.data = [];
    this.data.push(this.getChartValue(new Date(), 0));
    // initialize chart options:
    this.options = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          params = params[0];
          return  '时间:' +params.axisValueLabel + '<br/>' + '交易数:' + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: true
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true
        }
      },
      series: [{
        name: 'Mocking Data',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: this.data
      }]
    };

    // Mock dynamic data:
    this.timer = setInterval(() => {
      /*4秒钟请求一次，请求20次= 80秒后图平推*/
      if (this.data.length > 20) {
        this.data.splice(0, (this.data.length - 20));
      }
      this.getDealSecond();
    }, 4000);


  }
  /*******************查询每秒钟交易数量*************/
  /*mdb-cli mdbserv_show*/
  getDealSecond() {
    this._config.getDealSecond('').subscribe( value => {
        this.curValue = value;
        let v = parseFloat(value);
        /*当后台返回为空时，图停止*/
        if(value != '') {
          this.data.push(this.getChartValue(new Date(), v ));
        }
        this.updateOptions = {
          series: [{
            data: this.data
          }]
        };
    })
  }

  getChartValue(d, v) {
    return {
      name: d.toString(),
      value: [
        d,
        v
      ]
    }
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }

}
