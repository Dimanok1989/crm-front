import { useCrmContext } from "@/crm/Provider";
import Card from "../Views/Card";
import { Button, Form, Header, Image } from "semantic-ui-react";
import Link from "next/link";
import useFormdata from "@/hooks/useFormdata";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { axios } from "@/hooks/useAxios";
import useApi from "@/hooks/useApi";
import Message from "../Views/Message";

interface LoginProps {
    render?: boolean;
    setIsRegistration?: Dispatch<SetStateAction<boolean>>;
}

interface RegisterErrors {
    login?: string;
    password?: string;
    password_confirmation?: string;
}

const Registration = ({ render, setIsRegistration }: LoginProps) => {

    const app = useCrmContext();
    const { formdata, handleChange } = useFormdata({});
    const [login, setLogin] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [errors, setErrors] = useState<RegisterErrors>({});

    useEffect(() => {
        if (login) {
            axios.post('user/registration', formdata)
                .then(({ data }) => {
                    app.setData(data);
                })
                .catch(error => {
                    setError(error?.response?.data?.message || error?.message);
                    setErrors(error?.response?.data?.errors || {});
                })
                .then(() => {
                    setLogin(false);
                });
        }
    }, [login]);

    return <div className="w-screen h-screen flex items-start justify-center py-7 px-4">
        <Card className="w-96">

            <Image src="/favicon.ico" width={50} height={50} centered />
            <Header as="h2" className="text-center !mt-2">Регистрация</Header>

            <Form loading={login} className="mb-4" error={Boolean(error)}>
                <Form.Input
                    label="Логин"
                    placeholder="Введите логин"
                    name="login"
                    onChange={handleChange}
                    error={Boolean(errors?.login)}
                />
                <Form.Input
                    label="Пароль"
                    placeholder="Укажите пароль"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    error={Boolean(errors?.password)}
                />
                <Form.Input
                    label="Проверочный пароль"
                    placeholder="Укажите пароль ещё раз"
                    type="password"
                    name="password_confirmation"
                    onChange={handleChange}
                    error={Boolean(errors?.password_confirmation)}
                />

                {error && <Message error content={error} size="tiny" />}

                <Button
                    content="Зарегистрироваться"
                    icon="sign-in"
                    fluid
                    color="green"
                    onClick={() => setLogin(true)}
                    className="!mt-5"
                />
                <div className="text-center mt-3">
                    <div className="text-center mt-3">
                        {render && <a
                            className="cursor-pointer"
                            onClick={() => typeof setIsRegistration == "function" && setIsRegistration(false)}
                        >Авторизация</a>}
                        {!render && <Link href="/auth/login">Авторизация</Link>}
                    </div>
                </div>
            </Form>
        </Card>
    </div>
}

export default Registration;