import { AxiosError, AxiosResponse } from "axios";
import { axios } from "./useAxios";
import { useState } from "react";

type MethodProps = {
    url: string;
    formdata?: object;
}

const useApi = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<null | number>(null);
    const [response, setResponse] = useState<null | AxiosResponse>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [errors, setErrors] = useState<object>({});

    const post = (url: string, formdata?: object) => {

        setIsLoading(true);

        axios.post(url, formdata)
            .then(response => {
                setStatus(response.status);
                setResponse(response.data);
            })
            .catch(err => {
                setStatus(err?.response?.status || 400);
                setIsError(true);
                setError(err?.message || "Неизвестная ошибка");
                setErrors(err?.response?.data?.errors || {});
            })
            .then(() => {
                setIsLoading(false);
            });

        return response;
    }

    return {
        post,
        status,
        response,
        isLoading,
        isError,
        error,
        errors,
    }
}

export default useApi;