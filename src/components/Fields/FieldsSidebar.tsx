import { useEffect, useState } from "react";
import { Button, Icon, Loader } from "semantic-ui-react";
import Message from "../Views/Message";
import { axios, getError } from "@/hooks/useAxios";
import FieldEdit from "./FieldEdit";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setIsCreate, setFields as storeFields } from "@/stores/fields";

export default function FieldsSidebar() {

    const [show, setShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    const dispatch = useAppDispatch();
    const { fields, isCreate } = useAppSelector((state) => state.fields);
    const setFields = (fields: any) => {
        dispatch(storeFields(fields));
    }

    useEffect(() => {
        return () => {
            setLoading(true);
            dispatch(setIsCreate(false));
        }
    }, []);

    useEffect(() => {

        setLoading(true);

        if (show) {
            axios.get('fields', { params: { type: "leads" } })
                .then(({ data }) => {
                    setError(null);
                    setFields(data);
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
            dispatch(setIsCreate(false));
        }
    }, [show]);

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

                    {!isCreate && <>
                        {fields.length === 0 && <div className="text-gray-500 mb-5">
                            <div className="mb-3">Здесь ещё ничего нет!</div>
                            <div>Добавьте дополнительные поля для расширения данных в заяваках</div>
                        </div>}
                        {fields.length > 0 && <div className="mb-5">
                            {fields.map(item => <Field
                                key={item.id}
                                field={item}
                            />)}
                        </div>}
                    </>}

                    <FieldEdit />

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

function Field({ field }: any) {

    const { id, title, typeName } = field;
    const dispatch = useAppDispatch();

    return <div className="my-1 px-3 py-2 cursor-pointer rounded hover:bg-gray-100 flex gap-2">
        <div>{title}</div>
        <div className="opacity-60 grow">{typeName}</div>
        <div >
            <Icon
                name="pencil"
                link
                onClick={() => dispatch(setIsCreate(id))}
            />
        </div>
    </div>
}
