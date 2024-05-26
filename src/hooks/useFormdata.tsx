import { ChangeEvent, useState } from "react"

const useFormdata = (data: object = {}): any => {

    const [formdata, setFormdata] = useState(data);

    const handleChange = (event: ChangeEvent | null, { name, value }: any) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }

    const clear = () => {
        setFormdata(data);
    }

    return {
        formdata,
        handleChange,
        clear
    }
}

export default useFormdata;