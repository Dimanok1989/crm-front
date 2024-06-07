import { Form, FormComponent } from "semantic-ui-react";

export default function Number(props: FormComponent) {
    return <Form.Input type="number" {...props} />
}