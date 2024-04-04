import { MessageProps, Message as SemanticMessage } from "semantic-ui-react"

const Message = (props: MessageProps) => {

    let className = `${props.className || ""} `;

    return <SemanticMessage
        {...props}
        className={`
            ${props.className || ""}
            !shadow-none 
            ${props.error ? `!bg-red-100 !border-red-50 !text-red-700 !shadow-red-100` : ``}
        `}
    />
}

export default Message;