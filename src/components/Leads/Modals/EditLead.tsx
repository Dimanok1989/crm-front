import useApi from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { Dimmer, Icon, Loader, Modal } from "semantic-ui-react";
import FormLead from "../Form/FormLead";
import useFormdata from "@/hooks/useFormdata";
import { axios } from "@/hooks/useAxios";

interface EditLeadProps {
    leadId: null | number;
    close: () => void;
}

export default function EditLead(props: EditLeadProps) {

    const { leadId, close } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<any>({});
    const { formdata, handleChange, clear, setFormdata } = useFormdata();

    useEffect(() => {
        if (leadId) {
            setLoading(true);
            axios.get(`leads/${leadId}/edit`)
                .then(({ data }) => {
                    setResponse(data);
                    setFormdata(data.lead || {});
                })
                .catch(e => {

                })
                .then(() => {
                    setLoading(false);
                });
        }
    }, [leadId]);

    useEffect(() => {

    }, []);

    return <Modal
        open={leadId !== null}
        header="Изменить заявку"
        centered={false}
        size="tiny"
        closeIcon={<Icon name="close" fitted link onClick={() => close()} />}
        content={<div className="p-5 relative">

            <FormLead
                loading={loading}
                formdata={formdata}
                handleChange={handleChange}
                statuses={response.statuses || []}
                customers={response.customers || []}
                fields={response.fields || []}
            />

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>

        </div>}
    />
}