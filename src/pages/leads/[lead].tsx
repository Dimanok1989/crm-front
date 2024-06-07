import Content from "@/components/Content";
import LeadFeed from "@/components/Leads/LeadFeed";
import EditLead from "@/components/Leads/Modals/EditLead";
import { StatusCard } from "@/components/Leads/TableLeads";
import Card from "@/components/Views/Card";
import useApi from "@/hooks/useApi";
import { FieldProps } from "@/stores/fields";
import moment from "moment";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Feed, Header, Icon } from "semantic-ui-react";

const ItemValue = (props: any) => <div className="flex items-center p-2 rounded cursor-default hover:bg-slate-50">
    <div className="min-w-[40%]"><strong>{props.text}</strong></div>
    <div>{props.value}</div>
</div>

export default function Leads() {

    const http = useApi({ isLoading: true });
    const params = useParams();
    const { response } = http;
    const fields: FieldProps[] = response?.fields || [];
    const [edit, setEdit] = useState<null | number>(null);

    useEffect(() => {
        http.get(`/leads/${params.lead}`);
    }, []);

    return <Content
        loading={http.isLoading}
        error={http.error}
    >
        <div className="flex flex-col gap-5">

            <div className="flex justify-between items-center">
                <Header
                    as="h1"
                    content={response?.name}
                    subheader={(response?.name && response.name !== response.number) && response.number}
                />
                <div>
                    <Icon
                        name="pencil"
                        link
                        fitted
                        title="Изменить заявку"
                        onClick={() => setEdit(response?.id || null)}
                    />
                    <EditLead
                    leadId={edit}
                    close={() => setEdit(null)}
                    />
                </div>
            </div>

            <Card>
                <ItemValue
                    text="Статус"
                    value={<StatusCard {...response?.status || {}} />}
                />
                <ItemValue
                    text="Стоимость"
                    value={response?.price}
                />
                <ItemValue
                    text="Дата и время события"
                    value={response?.event_start_at && moment(response.event_start_at).format("DD.MM.YYYY в HH:mm")}
                />
                <ItemValue
                    text="Клиент"
                    value={response?.customer?.name}
                />
                <ItemValue
                    text="Телефон"
                    value={response?.customer?.phone}
                />
                {fields.map((field: FieldProps) => <ItemValue
                    key={field.id}
                    text={field.title}
                    value={null}
                />)}
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