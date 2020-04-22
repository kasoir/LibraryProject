import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { NavbarComponent } from '../component/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';


enum styleAction {
    set = 1, remove = 2
}

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    loading: boolean = false;
    constructor(public location: Location, private router: Router) { }




    ngOnInit() {
        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
            // if we are on windows OS we activate the perfectScrollbar function

            document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
        }
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((event: any) => {

            if (event instanceof NavigationStart) {
               
                this.loading = true;
                if (event.url != this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }


            } else if (event instanceof NavigationEnd) {

                setTimeout(() => {
                   
                    this.loading = false;
                    if (event.url == this.lastPoppedUrl) {
                        this.lastPoppedUrl = undefined;
                        window.scrollTo(0, this.yScrollStack.pop());
                    } else {
                        window.scrollTo(0, 0);
                    }

                }, 200)

            }
            else if (event instanceof NavigationCancel || event instanceof NavigationError) {

                setTimeout(() => {
                   
                    this.loading = false;
                },  200)

            }

        });
        this._router = this.router.events.pipe( filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            if (elemMainPanel) {
                elemMainPanel.scrollTop = 0;
            }
            //    elemSidebar.scrollTop = 0;
        });
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            let ps: PerfectScrollbar;
            if (elemMainPanel) {
                ps = new PerfectScrollbar(elemMainPanel);
            }
            if (elemSidebar) {
                ps = new PerfectScrollbar(elemSidebar);
            }
        }
    }
    ngAfterViewInit() {
        this.runOnRouteChange();
    }

    isMaps(path) {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if (path == titlee) {
            return false;
        }
        else {
            return true;
        }
    }
    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            let ps: PerfectScrollbar;
            if (elemMainPanel) {
                ps = new PerfectScrollbar(elemMainPanel);
                ps.update();

            }
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

}

