import { axios, getError } from "@/hooks/useAxios";
import { useCallback, useEffect, useState } from "react";
import { Button, Form, Icon, Loader } from "semantic-ui-react";
import Message from "../Views/Message";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setField, setIsCreate } from "@/stores/fields";
import useFormdata from "@/hooks/useFormdata";

export default function FieldEdit() {

    const dispatch = useAppDispatch();
    const { isCreate } = useAppSelector((state) => state.fields);
    const { formdata, setFormdata, handleChange, clear } = useFormdata({});

    const [loading, setLoading] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [types, setTypes] = useState<any[]>([]);
    const [isOptions, setIsOptions] = useState<boolean>(false);

    const [save, setSave] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<null | string>(null);

    const close = useCallback(() => {
        dispatch(setIsCreate(false));
        clear();
        setSaveError(null);
    }, []);

    useEffect(() => {
        return () => {
            dispatch(setIsCreate(false));
            clear();
            setSaveError(null);
        }
    }, []);

    useEffect(() => {
        if (loading) {
            axios.get('fields/create')
                .then(({ data }) => {
                    setError(null);
                    setTypes(data.types || []);
                    dispatch(setIsCreate(true));
                })
                .catch(e => {
                    setError(getError(e));
                })
                .then(() => {
                    setLoading(false);
                });
        }
    }, [loading]);

    useEffect(() => {
        if (save) {

            const fetch = typeof isCreate == "number"
                ? axios.put(`fields/${isCreate}`, formdata)
                : axios.post(`fields?fieldable=leads`, formdata);

            fetch
                .then(({ data }) => {
                    setSaveError(null);
                    dispatch(setIsCreate(false));
                    dispatch(setField(data));
                    clear();
                })
                .catch(e => {
                    setSaveError(getError(e));
                })
                .then(() => {
                    setSave(false);
                });
        }
    }, [save]);

    useEffect(() => {
        if (typeof isCreate == "number") {
            setLoad(true);
            axios.get(`fields/${isCreate}/edit`)
                .then(({ data }) => {
                    setSaveError(null);
                    setFormdata(data.field || {});
                    setTypes(data.types || []);
                })
                .catch(e => {
                    setSaveError(getError(e));
                })
                .then(() => {
                    setLoad(false);
                });
        }
    }, [isCreate]);

    useEffect(() => {
        if (formdata?.type) {
            let type = types.find(e => e.id === formdata.type);
            setIsOptions(type?.isOptions === true);
        } else {
            setIsOptions(false);
        }
    }, [formdata?.type]);

    const options = (formdata?.options || [null]);

    return <div>

        {error && <Message error>{error}</Message>}

        {isCreate && <>

            <strong>
                <Icon name="plus" />
                <span>Новое поле</span>
            </strong>

            <Form className="mt-5" loading={typeof isCreate == "number" && load}>

                <Form.Input
                    label="Наименование"
                    name="title"
                    placeholder="Укажите наименование поля"
                    required
                    value={formdata.title || ""}
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

                {isOptions && options.map((item: null | string, key: number) => <Form.Input
                    key={key}
                    label={key === 0 && "Опции"}
                    placeholder={`Ввеите значние пункта №${key + 1}`}
                    onChange={(e, { value }) => {
                        let options = formdata?.options || [null];
                        options[key] = value;
                        handleChange(e, { name: "options", value: options })
                    }}
                    value={options[key] || ""}
                    action={<>
                        {options.length > 1 && <Button
                            className="!px-4"
                            color="red"
                            type="button"
                            basic
                            content={<Icon name="trash" fitted />}
                            onClick={(e) => {
                                let items = formdata?.options || [];
                                for (let i = 0; i < items.length; i++) {
                                    if (i === key) {
                                        items.splice(i, 1);
                                        break;
                                    }
                                }
                                handleChange(e, { name: "options", value: items })
                            }}
                        />}
                        {options.length === (key + 1) && <Button
                            className="!px-4"
                            color="blue"
                            type="button"
                            content={<Icon name="plus" fitted />}
                            onClick={() => {
                                let options = formdata?.options || [null];
                                options.push(null);
                                handleChange(null, { name: "options", value: options });
                            }}
                        />}
                    </>}
                />)}

                {typeof isCreate == "number" && load && <Loader />}

            </Form>

            {saveError && <Message error>{saveError}</Message>}

            <div className="flex gap-3 mt-4">
                <Button
                    color="green"
                    icon="save"
                    content={isCreate === true ? "Создать" : "Сохранить"}
                    onClick={() => setSave(true)}
                    loading={save}
                    disabled={
                        !Boolean(formdata?.title)
                        || !Boolean(formdata?.type)
                        || (isOptions && !Boolean(options[0]))
                    }
                />
                <Button
                    basic
                    onClick={() => !save && close()}
                    content="Отмена"
                />
            </div>

        </>}

        {!isCreate && <Button
            color="blue"
            onClick={() => {
                setLoading(true);
            }}
            content="Добавить"
            icon="plus"
            loading={loading}
        />}

    </div>
}