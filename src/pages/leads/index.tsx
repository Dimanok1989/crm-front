import Content from "@/components/Content";
import FieldsSidebar from "@/components/Fields/FieldsSidebar";
import CreateLeads from "@/components/Leads/Modals/CreateLead";
import TableLeads from "@/components/Leads/TableLeads";
import EmptyData from "@/components/Views/EmptyData";
import Message from "@/components/Views/Message";
import useApi from "@/hooks/useApi";
import { axios, getError } from "@/hooks/useAxios";
import useFormdata from "@/hooks/useFormdata";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setIsShowCreate, setLeads } from "@/stores/leads";
import { useEffect, useState } from "react"
import { Button, Dimmer, Form, Icon, Loader, Select } from "semantic-ui-react";

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
        actions={<div className="mx-3 flex gap-4">
            <Icon
                name="plus"
                fitted
                link
                onClick={() => dispatch(setIsShowCreate(true))}
                title="Добавить новую заявку"
                size="large"
            />
            <FieldsSidebar />
            {/* <Button onClick={() => dispatch(setIsShowCreate(true))} content="Добавить" /> */}
        </div>}
    >
        <CreateLeads />
        {data.leads.length === 0 && <EmptyData />}
        {data.leads.length > 0 && <TableLeads />}
    </Content>
}

const Settings = () => {

    const [show, setShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);
    const [fields, setFields] = useState<any[]>([]);

    const [create, setCreate] = useState<boolean>(false);
    const [createLoading, setCreateLoading] = useState<boolean>(true);
    const [createError, setCreateError] = useState<null | string>(null);
    const [types, setTypes] = useState<any[]>([]);
    const [isOptions, setIsOptions] = useState<boolean>(false);

    const [save, setSave] = useState<boolean>(false);

    const { clear, formdata, handleChange, setFormdata } = useFormdata({});

    useEffect(() => {
        return () => {
            setLoading(true);
            setCreate(false);
            setCreateLoading(false);
        }
    }, []);

    useEffect(() => {

        setLoading(true);

        if (show) {
            axios.get('fields', { params: { type: "leads" } })
                .then(({ data }) => {
                    setError(null);
                })
                .catch(e => {
                    setError(getError(e));
                })
                .then(() => {
                    setLoading(false);
                });
        }

        if (!show) {
            setError(null);
            setCreate(false);
            setCreateLoading(false);
            setCreateError(null);
        }
    }, [show]);

    useEffect(() => {

        if (create) {
            setCreateLoading(true);
            axios.get('fields/create')
                .then(({ data }) => {
                    setCreateError(null);
                    setTypes(data.types || []);
                })
                .catch(e => {
                    setCreate(false);
                    setCreateError(getError(e));
                })
                .then(() => {
                    setCreateLoading(false);
                });
        }

        if (!create) {
            clear();
            setCreateLoading(false);
        }

    }, [create]);

    useEffect(() => {

        if (formdata?.type) {
            let type = types.find(e => e.id === formdata.type);
            setIsOptions(type?.isOptions === true);
        } else {
            setIsOptions(false);
        }

    }, [formdata?.type]);

    useEffect(() => {

        if (save) {
            axios.post(`fields`, formdata)
                .then(({ data }) => {

                })
                .catch(e => {

                })
                .then(() => {
                    setSave(false);
                });
        }

    }, [save]);

    return <>

        <div className={`fixed inset-0 bg-black/80 z-10 ${show ? 'block' : 'hidden'}`}>
            <div className={`menu-slider bg-white text-black px-5 py-5 ${show ? 'sidebar-show' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <strong style={{ fontSize: "120%" }}>Дополнительные поля</strong>
                    <span>
                        {!loading && <Icon name="close" link onClick={() => setShow(p => !p)} />}
                    </span>
                </div>
                {loading && <Loader active={true} inline="centered" />}
                {!loading && error && <Message error>{error}</Message>}
                {!loading && !Boolean(error) && <>

                    {(!create || createLoading || Boolean(createError)) && <>

                        {fields.length === 0 && <div className="text-gray-500 mb-5">
                            <div className="mb-3">Здесь ещё ничего нет!</div>
                            <div>Добавьте дополнительные поля для расширения данных в заяваках</div>
                        </div>}

                        {createError && <Message error>{createError}</Message>}

                        <Button
                            color="blue"
                            onClick={() => {
                                setCreateLoading(true);
                                setCreate(true);
                            }}
                            content="Добавить"
                            icon="plus"
                            loading={createLoading}
                        />
                    </>}

                    {(create && !createLoading && createError === null) && <>

                        <strong>
                            <Icon name="plus" />
                            <span>Новое поле</span>
                        </strong>

                        <Form className="mt-5">
                            <Form.Input
                                label="Наименование"
                                name="name"
                                placeholder="Укажите наименование поля"
                                required
                                value={formdata.name || ""}
                                onChange={handleChange}
                            />
                            <Form.Select
                                label="Тип поля"
                                name="type"
                                options={[{ key: 0, id: null, name: "Не выбрано" }, ...types].map(i => ({
                                    key: i.key,
                                    value: i.id,
                                    text: i.name,
                                }))}
                                placeholder="Выберите тип поля"
                                value={formdata.type || null}
                                onChange={handleChange}
                                required
                            />

                            {isOptions && (formdata?.options || [null]).map((item: null | string, key: number) => <Form.Input
                                key={key}
                                label={key === 0 && "Опции"}
                                placeholder={`Ввеите значние пункта №${key + 1}`}
                                onChange={(e, { value }) => {
                                    setFormdata((p: any) => {
                                        let options = p?.options || [null];
                                        options[key] = value;
                                        p.options = options;
                                        return p;
                                    });
                                }}
                                action={<>
                                    {(formdata?.options || [null]).length > 1 && <Button
                                        className="!px-4"
                                        color="red"
                                        type="button"
                                        basic
                                        content={<Icon name="trash" fitted />}
                                        onClick={() => {
                                            setFormdata((p: any) => {
                                                let options: any[] = [];
                                                (p?.options || [null]).forEach((i: any, k: number) => {
                                                    if (k !== key) {
                                                        options.push(i);
                                                    }
                                                });
                                                p.options = options.length > 0 ? options : [null];
                                                return p;
                                            });
                                        }}
                                    />}
                                    {(formdata?.options || [null]).length === (key + 1) && <Button
                                        className="!px-4"
                                        color="blue"
                                        type="button"
                                        content={<Icon name="plus" fitted />}
                                        onClick={() => {
                                            let options = formdata?.options || [null];
                                            options.push(null);
                                            handleChange(null, { name: "options", value: options });
                                        }}
                                    />
                                    }
                                </>}
                            />)}

                        </Form>
                        <div className="flex gap-3 mt-4">
                            <Button color="green" icon="save" content="Создать" onClick={() => setSave(true)} />
                            <Button basic onClick={() => setCreate(false)}>Отмена</Button>
                        </div>
                    </>}
                </>}
            </div>
        </div>

        <Icon
            name="setting"
            fitted
            link
            title="Настройки таблицы"
            onClick={() => setShow(p => !p)}
            size="large"
        />
    </>
}
