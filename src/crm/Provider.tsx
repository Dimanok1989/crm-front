import React, { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { axios } from "@/hooks/useAxios";
import { SemanticICONS } from "semantic-ui-react";

interface ProviderValues {
    loading: boolean;
    data: AppData;
    setData?: any;
    isLogin?: boolean;
    sidebarOpen?: boolean;
    openSidebar?: () => void;
    closeSidebar?: () => void;
}

export type MenuItemProps = {
    route: string;
    name: string;
    icon?: SemanticICONS;
}

type AppData = {
    profile?: any;
    menu?: MenuItemProps[],
    token?: string;
}

// create new context
export const AppContext = React.createContext<ProviderValues>({
    loading: true,
    data: {},
});

interface CrmProviderProps {
    children: React.ReactNode;
}

export function CrmProvider({ children }: CrmProviderProps) {

    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<AppData>({});
    const [isLogin, setIsLogin] = React.useState(false);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const router = useRouter();

    const openSidebar = React.useCallback(() => {
        setSidebarOpen(true);
    }, []);

    const closeSidebar = React.useCallback(() => {
        setSidebarOpen(false);
    }, []);

    React.useEffect(() => {
        if (data) {
            setIsLogin(true);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
        }
    }, [data]);

    // Загрузка данных приложения
    React.useEffect(() => {

        axios.get('app')
            .then(({ data }) => {
                setData(data);
                setIsLogin(true);
            })
            .catch(({ response }) => {
                setIsLogin(false);
            })
            .then(() => {
                setLoading(false);
            });

    }, []);

    // set the html tag overflow to hidden
    React.useEffect(() => {
        document.documentElement.style.overflow = "hidden";
    }, []);

    // close Sidebar on route changes when viewport is less than 1024px
    React.useEffect(() => {
        document.documentElement.style.overflow = "hidden";
    }, []);

    // close side navigation when route changes
    React.useEffect(() => {

        if (sidebarOpen) {
            router.events.on("routeChangeStart", () => setSidebarOpen(false));
        }

        return () => {
            if (sidebarOpen) {
                router.events.off("routeChangeStart", () => setSidebarOpen(false));
            }
        };
    }, [sidebarOpen, router]);

    return <AppContext.Provider value={{
        loading,
        data,
        setData,
        isLogin,
        sidebarOpen,
        openSidebar,
        closeSidebar
    }}>
        {children}
    </AppContext.Provider>
}

export const AppConsumer = AppContext.Consumer;

// custom hook to consume all context values { sidebarOpen, openSidebar, closeSidebar }
export function useCrmContext() {
    return React.useContext(AppContext);
}
