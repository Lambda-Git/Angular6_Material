import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-block-deal-detail',
  templateUrl: './block-deal-detail.component.html',
  styleUrls: ['./block-deal-detail.component.css']
})
export class BlockDealDetailComponent implements OnInit {

  dealDetailJson;
  title;

  constructor(
    private _sheetRef: MatDialogRef<BlockDealDetailComponent>,
    // /*Inject装饰器*/
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dealDetailJson = JSON.stringify(data.data,null,2);
    this.title = data.title;
  }

  ngOnInit() {
  }

}
