import Message from "@/components/Views/Message";
import useApi from "@/hooks/useApi";
import useFormdata from "@/hooks/useFormdata";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { appendLead, setIsShowCreate } from "@/stores/leads";
import { useCallback, useEffect } from "react";
import { Dimmer, Form, Icon, Loader, Modal } from "semantic-ui-react";
import ClientField from "../Form/ClientField";

export default function CreateLeads() {

    const open = useAppSelector((state) => state.leads.isShowCreate)
    const dispatch = useAppDispatch();
    const { formdata, handleChange, clear } = useFormdata();
    const create = useApi();
    const store = useApi({
        success: (data) => {
            dispatch(setIsShowCreate(false));
            dispatch(appendLead(data));
        }
    });

    const close = useCallback(() => {
        dispatch(setIsShowCreate(false));
        create.clear();
        store.clear();
        clear();
    }, []);

    useEffect(() => {
        if (open) {
            create.get('leads/create');
        }
    }, [open]);

    const save = useCallback(() => {
        store.post('leads', formdata);
    }, [formdata]);

    return <Modal
        open={open}
        header="Новая заявка"
        centered={false}
        size="tiny"
        closeIcon={<Icon name="close" fitted link onClick={() => close()} />}
        content={<div className="p-5 relative">

            {create.isError && <Message error content={create.error} className="!mb-0" />}
            {!create.isError && <Form>

                <Form.Select
                    label="Статус"
                    placeholder="Выберите статус"
                    options={(create.response?.statuses || []).map((i: any) => ({
                        value: i.id,
                        text: <div className="flex items-center gap-3">
                            {i.color && <span className="w-3 h-3 rounded" style={{ background: i.color }}></span>}
                            <span>{i.name}</span>
                        </div>,
                    }))}
                    name="status_id"
                    onChange={handleChange}
                    value={formdata.status_id || ""}
                    required
                    disabled={store.isLoading}
                    error={store?.errors?.status_id}
                />

                <ClientField
                    name="customer_id"
                    onChange={handleChange}
                    value={formdata.customer_id || ""}
                    disabled={store.isLoading}
                    error={store?.errors?.customer_id}
                    customers={create.response?.customers || []}
                />

                <Form.Input
                    label="Дата и время"
                    placeholder="Дата и время записи"
                    type="datetime-local"
                    name="event_start_at"
                    onChange={handleChange}
                    value={formdata.event_start_at || ""}
                    required
                    disabled={store.isLoading}
                    error={store?.errors?.event_start_at}
                />

                <Form.Input
                    label="Наименование"
                    placeholder="Введите наименование"
                    name="name"
                    onChange={handleChange}
                    value={formdata.name || ""}
                    disabled={store.isLoading}
                    error={store?.errors?.name}
                />

            </Form>}

            <Dimmer active={create.isLoading} inverted className="rounded">
                <Loader />
            </Dimmer>

        </div>}
        actions={[
            {
                key: "save",
                content: "Сохранить",
                icon: "save",
                positive: true,
                onClick: () => save(),
                disabled: create.isLoading || create.isError || store.isLoading,
                loading: store.isLoading,
            }
        ]}
    />
}
