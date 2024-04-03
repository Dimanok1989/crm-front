import { ChangeEvent, useState } from "react"

const useFormdata = (data: object = {}) => {

    const [formdata, setFormdata] = useState(data);

    const handleChange = (event: ChangeEvent, { name, value }: any) => {
        setFormdata(p => ({ ...p, [name]: value }));
    }

    return {
        formdata,
        handleChange,
    }
}

export default useFormdata;