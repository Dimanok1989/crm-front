import { axios } from "@/hooks/useAxios";
import useFormdata from "@/hooks/useFormdata";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItemProps, Form, Icon, Message, Modal } from "semantic-ui-react";

type ClientFieldProps = {
    name?: string;
    label?: string;
    placeholder?: string;
    fluid?: boolean;
    onChange?: any;
    value?: any;
    disabled?: boolean;
    error?: string;
    customers: ClientOption[],
};

type ClientOption = any;

let timeout: any = null;

export default function ClientField({
    name,
    label,
    placeholder,
    fluid,
    disabled,
    onChange,
    value,
    customers,
}: ClientFieldProps) {

    const [addShow, setAddShow] = useState<boolean>(false);
    const [options, setOptions] = useState<ClientOption[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const controller = useRef<any>(null);

    const { formdata, handleChange, clear } = useFormdata();
    const [store, setStore] = useState<boolean>(false);
    const [storeError, setStoreError] = useState<string | null>(null);

    useEffect(() => {
        setOptions(customers);
    }, [customers]);

    useEffect(() => {
        !addShow && clear();
        !addShow && setStoreError(null);
    }, [addShow]);

    const handleSearchChange = (e: any, { searchQuery }: any) => {

        controller.current && controller.current.abort();
        controller.current = new AbortController();
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            setIsFetching(true);
            axios.get('customers/search', {
                params: { query: searchQuery },
                signal: controller.current.signal
            }).then(({ data }) => {
                setError(null);
                setOptions(data.data)
            }).catch(err => {
                setError(err?.response?.message || err?.message || "Ошибка");
            }).then(() => {
                setIsFetching(false);
            });
        }, 300);
    }

    useEffect(() => {

        if (store) {
            axios.post('customers', formdata)
                .then(({ data }) => {
                    setStoreError(null);
                    setOptions(p => ([data, ...p]));
                    if (typeof onChange == "function") {
                        onChange(null, { name, value: data.id });
                    }
                    setAddShow(false);
                })
                .catch(err => {
                    setStoreError(err?.response?.message || err?.message || "Ошибка");
                })
                .then(() => {
                    setStore(false);
                });
        }

    }, [store]);

    return <Form.Field>
        <label>Клиент</label>
        <Dropdown
            name={name}
            label={label || "Клиент"}
            placeholder={placeholder || "Выберите клиента"}
            selection
            fluid={fluid}
            options={options.map(i => ({ value: i.id, text: i.name }))}
            noResultsMessage="Ничего не найдено"
            search
            onSearchChange={handleSearchChange}
            onChange={onChange}
            loading={isFetching}
            disabled={disabled}
            error={Boolean(error)}
            value={value}
        />
        <div className="mt-2 text-blue-500 flex items-center justify-end opacity-60 hover:opacity-100 cursor-pointer" onClick={() => setAddShow(true)}>
            <Icon name="user plus" />
            <span>Добавить клиента</span>
        </div>

        <Modal
            open={addShow}
            dimmer="inverted"
            header="Новый клиент"
            closeIcon={() => !store && <Icon
                name="close"
                color="black"
                link
                fitted
                onClick={() => setAddShow(false)}
            />}
            size="mini"
            content={<div className="p-5 relative">

                <Form loading={store} className="mt-1">
                    <Form.Input
                        label="Телефон"
                        placeholder="Укажите номер телефон"
                        required
                        name="phone"
                        onChange={handleChange}
                        value={formdata.phone || ""}
                        icon="phone"
                    />
                    <Form.Input
                        label="Имя"
                        placeholder="Укажите имя"
                        required
                        name="firstname"
                        onChange={handleChange}
                        value={formdata.firstname || ""}
                        icon="user"
                    />
                    <Form.Input
                        label="Фамилия"
                        placeholder="Укажите фамилию"
                        name="lastname"
                        onChange={handleChange}
                        value={formdata.lastname || ""}
                    />
                    <Form.Input
                        label="Отчество"
                        placeholder="Укажите отчество"
                        name="patronymic"
                        onChange={handleChange}
                        value={formdata.patronymic || ""}
                    />
                    {storeError && <p className="text-red-500 font-bold">{storeError}</p>}
                    <Button
                        content="Добавить"
                        color={storeError ? "red" : "green"}
                        fluid
                        icon="save"
                        labelPosition="left"
                        disabled={!Boolean(formdata.phone) || !Boolean(formdata.firstname)}
                        onClick={() => setStore(true)}
                    />
                </Form>

            </div>}
        />

    </Form.Field>
}