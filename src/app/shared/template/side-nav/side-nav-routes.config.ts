import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
    {
        path: '',
        title: 'Dashboard',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'dashboard',
        submenu: []
    },
    {
      path: '',
      title: 'Autenticación',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'lock',
      submenu: [
          {
              path: 'roles',
              title: 'Roles y Permisos',
              iconType: '',
              icon: '',
              iconTheme: '',
              submenu: []
          },
          {
            path: 'usuarios',
            title: 'Usuarios',
            iconType: '',
            icon: '',
            iconTheme: '',
            submenu: []
        }
      ]
    },
    {
      path: 'venta',
      title: 'Personas',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'dollar',
      submenu: []
    },
    {
      path: '',
      title: 'Empleados',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'dollar',
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
