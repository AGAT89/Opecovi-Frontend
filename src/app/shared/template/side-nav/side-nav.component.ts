import { Component } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { SideNavInterface } from '../../interfaces/side-nav.type';

@Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html'
})

export class SideNavComponent{

     menuItems: any[] = [];
     auxMenu : SideNavInterface[] = [];
    isFolded : boolean;
    isSideNavDark : boolean;
    isExpand : boolean;

    usuario: any;

    constructor( private themeService: ThemeConstantService) {}

    ngOnInit(): void {
        // Recupera la cadena de texto desde localStorage
        const jsonString = localStorage.getItem('usuario');

        // Convierte la cadena de texto a un objeto JSON
        this.usuario = JSON.parse(jsonString);

        this.usuario.rol.permisos.forEach(element => {
          console.log(element.modulo);
          if (element.es_activo == 1) {
            let item: SideNavInterface = {
              path: element.modulo.path.toString(),
              title: element.modulo.nomb_modulo.toString(),
              iconType: 'nzIcon',
              icon: element.modulo.icon,
              iconTheme: 'outline',
              submenu: []
            };
            this.auxMenu.push(item);
          }

        });

         this.menuItems = this.auxMenu;//ROUTES.filter(menuItem => menuItem);
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    }

    closeMobileMenu(): void {
        if (window.innerWidth < 992) {
            this.isFolded = false;
            this.isExpand = !this.isExpand;
            this.themeService.toggleExpand(this.isExpand);
            this.themeService.toggleFold(this.isFolded);
        }
    }
}
