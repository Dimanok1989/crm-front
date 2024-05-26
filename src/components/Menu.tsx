import { MenuItemProps } from "@/crm/Provider";
import { useApp } from "@/hooks/useApp";
import { useRouter } from "next/router";
import { Icon } from "semantic-ui-react";

const MenuItem = (props: MenuItemProps) => {

    const { route, name, icon } = props;
    const router = useRouter();
    const active = router.pathname === route
        || router.pathname.indexOf(route) === 0;

    return <div
        className={`flex items-center py-2 px-3 rounded hover:bg-gray-100 cursor-pointer ${active ? 'bg-gray-100 hover:bg-gray-200' : ''}`}
        onClick={() => route && router.push(route)}
        children={<>
            {icon && <span className={`me-2 text-lg ${active ? 'text-blue-600' : 'text-gray-500'}`}>
                <Icon name={icon} fitted />
            </span>}
            <span className="font-semibold">{name}</span>
        </>}
    />
}

const MenuRow = (props: MenuItemProps) => <>
    <MenuItem {...props} />
</>

export default function Menu() {

    const { data } = useApp();

    return <div className="w-[16rem] pt-4 px-4 fixed top-[4rem] left-0 bottom-0 bg-white">
        {data.menu && data.menu.map((item, key) => <MenuRow key={key} {...item} />)}
    </div>
}