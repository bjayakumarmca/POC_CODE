import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.LIST.SAAS',
        icon: 'bx-home-circle',
        link: '/dashboards/saas',
    },
    {
        id:3,
        label: 'MENUITEMS.PROJECTS.LIST.GRID',
        icon: 'bx bx-code-alt',
        link: '/projects/grid',
    },
   
   
];

