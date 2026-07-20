export interface MenuItem {
  title: string;
  icon: string;
  route: string;
  roles?: string[];
  children?: MenuItem[];
}
 export const MENU_ITEMS: MenuItem[] = [

  {
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard'
  },

  {
    title: 'User Management',
    icon: 'groups',
    route: '',
    roles: ['superAdmin','DCC','CC',],

    children: [

      {
        title: 'Government Users',
        icon: 'badge',
        route: '/government-users',
        roles: ['superAdmin','DCC',
      'CC',
      'ACC',]
      },

      {
        title: 'Citizens',
        icon: 'person',
        route: '/citizens',
        roles: ['superAdmin','DCC',
      'CC',
      'ACC',]
      },
         
    ]
  },

  {
    title: 'Cases',
    icon: 'folder',
    route: '/cases',
    roles: [
      'superAdmin',
      'DCC',
      'CC',
      'ACC',
      'Chief'
    ]
  },

  {
    title: 'Clients',
    icon: 'people',
    route: '/clients',
    roles: [
      'superAdmin','DCC',
      'CC',
      'ACC'
    ]
  },

  {
    title: 'Reports',
    icon: 'description',
    route: '/reports',
    roles: [
      'superAdmin',
      'CC','DCC',
      'ACC',
      'Chief'
    ]
  }

];