import { Component, OnInit, Input } from '@angular/core';
import { ToolbarHelpers } from "./toolbar.helpers";
// import { ConfigService } from "../../services/service.module";
import { McConfirmService } from '../../modules/mc-confirm/mc-confirm.module';
@Component({
  selector: "cdk-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  @Input() sidenav;
  @Input() sidebar;
  @Input() drawer;
  @Input() matDrawerShow;

  searchOpen: boolean = false;
  toolbarHelpers = ToolbarHelpers;
  constructor(
    // private _config: ConfigService,
    private _confirm: McConfirmService
  ) {}

  ngOnInit() {}

  doSaveConfig() {
    this._confirm.confirm({
      message: '保存后所有配置在下次启动时依然生效，是否继续？',
      onAccept: () => {
        // this._config.saveAllConfig().subscribe(data => {
        //   if (data) {
        //     this._confirm.alert("所有配置已经保存");
        //   } else {
        //     this._confirm.alert("配置保存出错，请稍后再试");
        //   }
        // });
      }
    });
  }
}
