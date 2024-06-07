import { Routes } from '@angular/router';
import { RolesComponent } from 'src/app/modules/roles/roles.component';
// import { UsuariosComponent } from 'src/app/modules/usuarios/usuarios.component';

export const CommonLayout_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
    },
    {
      path: 'roles',
      loadChildren: () => import('../../modules/roles/roles.module').then(m => m.RolesModule),
    },
    {
      path: 'usuarios',
      loadChildren: () => import('../../modules/usuarios/usuarios.module').then(m => m.UsuariosModule),
    },
    {
      path: 'empleados',
      loadChildren: () => import('../../modules/empleados/empleados.module').then(m => m.EmpleadosModule),
    },
    // {
    //   path: 'roles',
    //   component: RolesComponent
    //   //loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
    // },
    // {
    //   path: 'usuarios',
    //   component: UsuariosComponent
    //   //loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
    // },
    {
        path: 'venta',
        loadChildren: () => import('../../venta/venta.module').then(m => m.VentaModule),
    }
];
