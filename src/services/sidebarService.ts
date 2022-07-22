import { IconFormat } from 'components/atoms/Icon';
import { ajax } from 'hook/useApi';

const sidebarService = {
    fetch: async (): Promise<SidebarProps> => {
        let data = await ajax<{
            sidebar: SidebarProps
        }>({
            url: 'sidebar/get',
        });

        return data.sidebar;
    }
}

export default sidebarService;


export interface MenuItem {
    title: string,
    name: string,
    icon?: IconFormat,
    href?: string,
    label?: ANY,
    children?: MenuItem[]
}

export interface SidebarProps {
    title: string,
    description: string,
    icon: IconFormat,
    isBelow?: boolean,
    pages: MenuItem[],
    component?: string,
}

export interface ListSidebarProps {
    [key: string]: SidebarProps
}

