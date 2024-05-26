import { AxiosError, AxiosResponse } from "axios";
import { axios } from "./useAxios";
import { useEffect, useState } from "react";

interface ApiResponse {
    get: (url: string, formdata?: any) => void;
    post: (url: string, formdata?: any) => void;
    status: null | number,
    response: any,
    isLoading: boolean;
    isError: boolean;
    error: null | string;
    errors: any;
    clear: () => void;
}

type ApiProps = {
    isLoading?: boolean;
    success?: (data: any) => void;
}

const useApi = (props: ApiProps = {}): ApiResponse => {

    const [isLoading, setIsLoading] = useState<boolean>(typeof props.isLoading == "boolean" ? props.isLoading : false);
    const [status, setStatus] = useState<null | number>(null);
    const [response, setResponse] = useState<null | AxiosResponse>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [errors, setErrors] = useState<object>({});

    const success = (response: AxiosResponse) => {
        setStatus(response.status);
        setResponse(response.data);
        setIsError(false);
        setError(null);
        setErrors({});
        typeof props?.success == "function" && props.success(response.data)
    }

    const fail = (error: AxiosError) => {
        setStatus(error?.response?.status || 400);
        setIsError(true);
        const data: any = error?.response?.data || {};
        setError(data?.message || error?.message || "Неизвестная ошибка");
        setErrors(data?.errors || {});
    }

    const done = () => {
        setIsLoading(false);
    }

    const get = (url: string, formdata?: any) => {
        setIsLoading(true);
        axios.get(url, { params: formdata })
            .then(success)
            .catch(fail)
            .then(done);
    }

    const post = (url: string, formdata?: object) => {
        setIsLoading(true);
        axios.post(url, formdata)
            .then(success)
            .catch(fail)
            .then(done);
    }

    const clear = () => {
        setIsLoading(false);
        setStatus(null);
        setResponse(null);
        setIsError(false);
        setError(null);
        setErrors({});
    }

    return {
        get,
        post,
        status,
        response,
        isLoading,
        isError,
        error,
        errors,
        clear,
    }
}

export default useApi;