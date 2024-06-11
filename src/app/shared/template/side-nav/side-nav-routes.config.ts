import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
    // {
    //     path: '',
    //     title: 'Dashboard',
    //     iconType: 'nzIcon',
    //     iconTheme: 'outline',
    //     icon: 'dashboard',
    //     submenu: []
    // },
    // {
    //   path: '',
    //   title: 'Autenticación',
    //   iconType: 'nzIcon',
    //   iconTheme: 'outline',
    //   icon: 'lock',
    //   submenu: [
    //       {
    //           path: 'roles',
    //           title: 'Roles y Permisos',
    //           iconType: '',
    //           icon: '',
    //           iconTheme: '',
    //           submenu: []
    //       },
    //       {
    //         path: 'usuarios',
    //         title: 'Usuarios',
    //         iconType: '',
    //         icon: '',
    //         iconTheme: '',
    //         submenu: []
    //     }
    //   ]
    // },
    {
      path: 'roles',
      title: 'Roles y Permisos',
      iconType: 'nzIcon',
      icon: 'lock',
      iconTheme: 'outline',
      submenu: []
    },
    {
      path: 'usuarios',
      title: 'Usuarios',
      iconType: 'nzIcon',
      icon: 'usergroup-add',
      iconTheme: 'outline',
      submenu: []
    },
    {
      path: 'areas',
      title: 'Areas',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },
    {
      path: 'cargos',
      title: 'Cargos',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },
    {
      path: 'personas',
      title: 'Personas',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },
    {
      path: 'empleados',
      title: 'Empleados',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },
    {
      path: 'proveedores',
      title: 'Proveedores',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },
    {
      path: 'requerimientos',
      title: 'Requerimientos Emitidos',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },
    {
      path: 'requerimientos-recibidos',
      title: 'Requerimientos Recibidos',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },
    {
      path: '',
      title: 'Solicitudes de Compra',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },
    {
      path: '',
      title: 'Ordenes de Compra',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },
    {
      path: '',
      title: 'Cotizaciones',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'user',
      submenu: []
    },

    // {
    //     path: '',
    //     title: 'Multi Level Menu',
    //     iconType: 'nzIcon',
    //     iconTheme: 'outline',
    //     icon: 'appstore',
    //     submenu: [
    //         {
    //             path: '',
    //             title: 'Level 1',
    //             iconType: '',
    //             icon: '',
    //             iconTheme: '',
    //             submenu: [
    //                 {
    //                     path: '',
    //                     title: 'Level 2',
    //                     iconType: 'nzIcon',
    //                     iconTheme: 'outline',
    //                     icon: '',
    //                     submenu: []
    //                 }
    //             ]
    //         }
    //     ]
    // }
]
