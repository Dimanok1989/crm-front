import moment from "moment";
import { Feed } from "semantic-ui-react"
import { StatusCard } from "./TableLeads";


export default function LeadFeed(props: any) {

    const { data } = props;

    return <Feed.Event>
        <Feed.Label image={data?.user ? data.user.avatar : "/assets/logo.svg"} />
        <Feed.Content>
            <Feed.Summary
                date={data?.createdAt && moment(data.createdAt).format("DD.MM.YYYY в HH:mm")}
                user={data?.user?.name ? { content: data.user.name, className: "text-blue-500" } : null}
                content={data?.title ? (data?.user ? String(data.title).toLowerCase() : data.title) : null}
            />
            {data?.status && <Feed.Extra
                text
                content={<StatusCard {...data.status} />}
            />}
        </Feed.Content>
    </Feed.Event>
}