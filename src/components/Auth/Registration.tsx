import { useCrmContext } from "@/crm/Provider";
import Card from "../Views/Card";
import { Button, Form, Header, Image } from "semantic-ui-react";
import Link from "next/link";
import useFormdata from "@/hooks/useFormdata";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { axios } from "@/hooks/useAxios";
import useApi from "@/hooks/useApi";

interface LoginProps {
    render?: boolean;
    setIsRegistration?: Dispatch<SetStateAction<boolean>>;
}

const Registration = ({ render, setIsRegistration }: LoginProps) => {

    const app = useCrmContext();
    const { formdata, handleChange } = useFormdata({});
    const [login, setLogin] = useState(false);
    const { post } = useApi();

    useEffect(() => {
        if (login) {
            console.log(post('user/registration', formdata));
            // axios.post('user/registration', formdata)
            //     .then(({ data }) => {

            //     })
            //     .catch(error => {

            //     })
            //     .then(() => {
            //         setLogin(false);
            //     });
        }
    }, [login]);

    return <div className="w-screen h-screen flex items-start justify-center py-7 px-4">
        <Card className="w-96">
            <Image src="/favicon.ico" width={50} height={50} centered />
            <Header as="h2" className="text-center !mt-2">Регистрация</Header>
            <Form loading={login} className="mb-4">
                <Form.Input
                    label="Логин"
                    placeholder="Введите логин"
                    name="login"
                    onChange={handleChange}
                />
                <Form.Input
                    label="Пароль"
                    placeholder="Укажите пароль"
                    type="password"
                    name="password"
                    onChange={handleChange}
                />
                <Form.Input
                    label="Проверочный пароль"
                    placeholder="Укажите пароль ещё раз"
                    type="password"
                    name="password_confirmation"
                    onChange={handleChange}
                />
                <Button
                    content="Зарегистрироваться"
                    icon="sign-in"
                    fluid
                    color="green"
                    onClick={() => setLogin(true)}
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