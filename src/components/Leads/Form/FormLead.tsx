import { Form } from "semantic-ui-react";
import ClientField from "./ClientField";
import { useEffect } from "react";
import moment from "moment";
import { FieldProps } from "@/stores/fields";
import SelectMultiple from "@/components/Fields/Items/SelectMultiple";
import Select from "@/components/Fields/Items/Select";
import Number from "@/components/Fields/Items/Number";
import String from "@/components/Fields/Items/String";

interface FormLeadProps {
    loading: boolean;
    formdata: any;
    handleChange: () => any;
    statuses: any[];
    customers: any[];
    fields?: FieldProps[];
    errors?: any;
}

export default function FormLead(props: FormLeadProps) {

    const { loading, formdata, handleChange, statuses, customers, errors, fields } = props;

    return <Form>

        <Form.Input
            label="Наименование"
            placeholder="Введите наименование"
            name="name"
            onChange={handleChange}
            value={formdata.name || ""}
            disabled={loading}
            error={errors?.name}
        />

        <Form.Select
            label="Статус"
            placeholder="Выберите статус"
            options={statuses.map((i: any) => ({
                value: i.id,
                text: <div className="flex items-center gap-3">
                    {i.color && <span className="w-3 h-3 rounded" style={{ background: i.color }}></span>}
                    <span>{i.name}</span>
                </div>,
            }))}
            name="status_id"
            onChange={handleChange}
            value={formdata.status_id || ""}
            required
            disabled={loading}
            error={errors?.status_id}
        />

        <Form.Input
            label="Стоимость"
            placeholder="Укажите стоимость"
            name="price"
            onChange={handleChange}
            value={formdata.price || ""}
            disabled={loading}
            error={errors?.price}
        />

        <Form.Input
            label="Дата и время"
            placeholder="Дата и время записи"
            type="datetime-local"
            name="event_start_at"
            onChange={handleChange}
            value={formdata.event_start_at ? moment(formdata.event_start_at).format("YYYY-MM-DD\THH:mm") : ""}
            required
            disabled={loading}
            error={errors?.event_start_at}
        />

        <ClientField
            name="customer_id"
            onChange={handleChange}
            value={formdata.customer_id || ""}
            disabled={loading}
            error={errors?.customer_id}
            customers={customers || []}
        />

        {(fields || []).map((field: FieldProps) => {

            let Item: any = null;
            let props = {
                label: field.title,
                placeholder: field.placeholder,
            }

            switch (field.typeKey) {
                case "input": Item = String; break;
                case "number": Item = Number; break;
                case "select": Item = Select; break;
                case "select_multiple": Item = SelectMultiple; break;
            }

            return Item && <Item
                {...props}
                onChange={handleChange}
                disabled={loading}
            />
        })}

    </Form>
}