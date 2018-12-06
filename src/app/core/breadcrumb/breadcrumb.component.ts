import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cdk-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  @Input() sideMenu;
  constructor() { }

  ngOnInit() {

  }

}
