import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'cdk-sidemenu-item',
    templateUrl: './sidemenu-item.component.html',
    styleUrls: ['./sidemenu-item.component.scss']
})
export class SidemenuItemComponent implements OnInit {

    @Input() menu;
    @Input() iconOnly: boolean;
    @Input() secondaryMenu = false;
    @Output() onSelected = new EventEmitter<any>()

    constructor(
        private _router: Router
    ) { }

    ngOnInit() {
        if ((this.menu.link) && (this._router.url == this.menu.link)) {
            if (this.onSelected) {
                this.onSelected.emit([this.menu]);
            }
        }
    }

    openLink() {
        this.menu.open = this.menu.open;
    }

    onClicked() {
        this.menu.open = !this.menu.open;
        if ((this.menu.link) && this.onSelected) {
            this.onSelected.emit([this.menu]);
        }
    }
    onChildSelected($event) {
        if (this.onSelected) {
            this.onSelected.emit([].concat(this.menu,$event));
        }
    }
    chechForChildMenu() {
        return (this.menu && this.menu.sub) ? true : false;
    }
}
