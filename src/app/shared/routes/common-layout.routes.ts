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
    {
      path: 'personas',
      loadChildren: () => import('../../modules/personas/personas.module').then(m => m.PersonasModule),
    },
    {
      path: 'proveedores',
      loadChildren: () => import('../../modules/proveedores/proveedores.module').then(m => m.ProveedoresModule),
    },
    {
      path: 'areas',
      loadChildren: () => import('../../modules/areas/areas.module').then(m => m.AreasModule),
    },
    {
      path: 'cargos',
      loadChildren: () => import('../../modules/cargos/cargos.module').then(m => m.CargosModule),
    },
    {
      path: 'requerimientos',
      loadChildren: () => import('../../modules/requerimientos/requerimientos.module').then(m => m.RequerimientosModule),
    },
    {
      path: 'requerimientos-recibidos',
      loadChildren: () => import('../../modules/requerimientos-recibidos/requerimientos-recibidos.module').then(m => m.RequerimientosRecibidosModule),
    },

];
