import Content from "@/components/Content";
import LeadFeed from "@/components/Leads/LeadFeed";
import { LeadResource, StatusCard } from "@/components/Leads/TableLeads";
import Card from "@/components/Views/Card";
import useApi from "@/hooks/useApi";
import moment from "moment";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Feed, Header } from "semantic-ui-react";

const ItemValue = (props: any) => <div className="flex items-center p-2 rounded cursor-default hover:bg-slate-50">
    <div className="min-w-[40%]"><strong>{props.text}</strong></div>
    <div>{props.value}</div>
</div>

export default function Leads() {

    const http = useApi({ isLoading: true });
    const params = useParams();
    const { response } = http;

    useEffect(() => {
        http.get(`/leads/${params.lead}`);
    }, []);

    return <Content
        loading={http.isLoading}
        error={http.error}
    >
        <div className="flex flex-col gap-5">

            <Header
                as="h1"
                content={response?.name}
                subheader={(response?.name && response.name !== response.number) && response.number}
            />

            <Card>
                <ItemValue text={"Статус"} value={<StatusCard {...response?.status || {}} />} />
                <ItemValue text={"Дата и время события"} value={response?.eventAt && moment(response.eventAt).format("DD.MM.YYYY в HH:mm")} />
            </Card>

            {(typeof response?.feeds == "object" && response?.feeds?.length > 0) && <Card>
                <Header as="h4">История изменений</Header>
                <Feed>
                    {response.feeds.map((i: any) => <LeadFeed key={i.id} data={i} />)}
                </Feed>
            </Card>}
        </div>
    </Content>

}