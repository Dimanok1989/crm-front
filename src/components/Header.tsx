import { useApp } from "@/hooks/useApp";
import { Image } from "semantic-ui-react";

export default function Header() {

    const app = useApp();

    return <div className="h-[4rem] px-5 fixed top-0 left-0 right-0 flex gap-2 items-center bg-white ">

        <div className="flex items-center gap-2 grow">
            <Image src="/assets/logo.svg" className="w-[2.5rem] h-[2.5rem] rounded" />
            <div className="font-sans text-xl font-bold">Kolgaev.RU CRM</div>
        </div>

        {app?.data?.profile && <div className="flex items-center gap-2">
            <div><Image src={app.data.profile.avatar} circular size="mini"/></div>
            <div>{app.data.profile.name}</div>
        </div>}

    </div>
}