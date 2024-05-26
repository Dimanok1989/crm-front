import Content from "@/components/Content"
import CreateLeads from "@/components/Leads/Modals/CreateLead";
import TableLeads from "@/components/Leads/TableLeads";
import EmptyData from "@/components/Views/EmptyData";
import useApi from "@/hooks/useApi";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setIsShowCreate, setLeads } from "@/stores/leads";
import { useEffect, useState } from "react"
import { Button, Icon, Loader } from "semantic-ui-react";

export default function Leads() {

    const [loading, setLoading] = useState(true);
    const http = useApi();

    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.leads);

    useEffect(() => {
        http.get('leads');
    }, []);

    useEffect(() => {
        dispatch(setLeads(http.response?.data || []));
        if (loading && http.response?.data?.length > 0) {
            setLoading(false);
        }

    }, [http.response?.data]);

    return <Content
        full
        title="Заявки"
        loading={loading}
        error={http.error}
        actions={<div className="mx-3">
            <Icon
                name="plus"
                fitted
                link
                onClick={() => dispatch(setIsShowCreate(true))}
                title="Добавить новую заявку"
                size="large"
            />
            {/* <Button onClick={() => dispatch(setIsShowCreate(true))} content="Добавить" /> */}
        </div>}
    >
        <CreateLeads />
        {data.leads.length === 0 && <EmptyData />}
        {data.leads.length > 0 && <TableLeads />}
    </Content>
}