import { useCrmContext } from "@/crm/Provider";
import Card from "../Views/Card";
import { Button, Form, Header, Image } from "semantic-ui-react";
import Link from "next/link";
import useFormdata from "@/hooks/useFormdata";
import { useEffect, useState } from "react";
import { axios } from "@/hooks/useAxios";
import Registration from "./Registration";
import Message from "../Views/Message";

interface LoginProps {
    render?: boolean;
}

const Login = ({ render }: LoginProps) => {

    const app = useCrmContext();
    const { formdata, handleChange } = useFormdata({});
    const [login, setLogin] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [isRegistration, setIsRegistration] = useState<boolean>(false);

    useEffect(() => {
        if (login) {
            axios.post('user/login', formdata)
                .then(({ data }) => {
                    app.setData(data);
                })
                .catch(error => {
                    setError(error?.response?.data?.message || error?.message);
                })
                .then((() => {
                    setLogin(false);
                }));
        }
    }, [login]);

    if (isRegistration) {
        return <Registration render setIsRegistration={setIsRegistration} />
    }

    return <div className="w-screen h-screen flex items-start justify-center py-7 px-4">
        <Card className="w-96">

            <Image src="/favicon.ico" width={50} height={50} centered />
            <Header as="h2" className="text-center !mt-2">Авторизация</Header>

            <Form loading={login} className="mb-4" error={Boolean(error)}>
                <Form.Input
                    label="Логин"
                    placeholder="Введите логин"
                    name="login"
                    onChange={handleChange}
                    error={Boolean(error)}
                />
                <Form.Input
                    label="Пароль"
                    placeholder="Укажите пароль"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    error={Boolean(error)}
                />

                {error && <Message error content={error} size="tiny" />}

                <Button
                    content="Войти"
                    icon="sign-in"
                    fluid
                    color="green"
                    onClick={() => setLogin(true)}
                    className="!mt-5"
                />

                <div className="text-center mt-3">
                    {render && <a className="cursor-pointer" onClick={() => setIsRegistration(true)}>Регистрация</a>}
                    {!render && <Link href="/auth/registration">Регистрация</Link>}
                </div>

            </Form>
        </Card>
    </div>
}

export default Login;