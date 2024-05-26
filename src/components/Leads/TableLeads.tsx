import { useAppSelector } from "@/stores/hooks";
import Card from "../Views/Card";
import { Dropdown, Icon, Table } from "semantic-ui-react";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";

export type LeadResource = any;

export default function TableLeads() {

    const data = useAppSelector((state) => state.leads);

    return <Card>
        <Table basic="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>Статус</Table.HeaderCell>
                    <Table.HeaderCell>Наименование</Table.HeaderCell>
                    <Table.HeaderCell>Клиент</Table.HeaderCell>
                    <Table.HeaderCell>Дата события</Table.HeaderCell>
                    <Table.HeaderCell>Дата создания</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.leads.map(i => <TableRow {...i} key={i.id} />)}
            </Table.Body>
        </Table>
    </Card>
}

/**
 * Карточка статуса
 * 
 * @param props 
 * @returns 
 */
export const StatusCard = (props: any) => <div className="flex items-center gap-3">
    {props.color && <span className="w-3 h-3 rounded" style={{ background: props.color }}></span>}
    <span>{props.name}</span>
</div>

const TableRow = (props: LeadResource) => {

    const router = useRouter();

    return <Table.Row className="cursor-default">
        <Table.Cell>
            <Dropdown
                icon={null}
                trigger={<span className="px-2"><Icon name="ellipsis vertical" link fitted /></span>}
                options={[
                    { key: 'details', text: 'Подробнее', icon: "eye", onClick: () => router.push(`/leads/${props.id}`) },
                    { key: 'complete', text: 'Завершить', icon: "check", disabled: true },
                    // { key: 'delete', text: 'Удалить', icon: "trash", disabled: true },
                ]}
            />
        </Table.Cell>
        <Table.Cell>{props.status && <StatusCard {...props.status} />}</Table.Cell>
        <Table.Cell><Link href={`/leads/${props.id}`}>{props.name}</Link></Table.Cell>
        <Table.Cell>
            {props.customer && <div>
                <div>{props.customer.name}</div>
                <small className="opacity-50">{props.customer.phone}</small>
            </div>}
        </Table.Cell>
        <Table.Cell>{props.eventAt && moment(props.eventAt).format("DD.MM.YYYY в HH:mm")}</Table.Cell>
        <Table.Cell>{props.createdAt && moment(props.createdAt).format("DD.MM.YYYY в HH:mm")}</Table.Cell>
    </Table.Row>
}