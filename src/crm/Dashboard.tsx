import Header from "@/components/Header";
import Menu from "@/components/Menu";
import React, { ReactElement } from "react";

interface Props {
    children: React.ReactNode;
}

const Dashboard = ({ children }: Props) => {

    return <>
        <Header />
        <div className="pt-[4rem] z-10 min-h-screen">
            <Menu />
            <div className="pl-[16rem]">
                {children}
            </div>
        </div>
    </>
}

export default Dashboard;