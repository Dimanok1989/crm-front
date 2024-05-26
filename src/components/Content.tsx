import React from "react";
import { Loader } from "semantic-ui-react";

type ContentProps = {
    children: React.ReactNode;
    full?: boolean;
    title?: string;
    loading?: boolean;
    error?: null | string;
    actions?: React.ReactNode,
}

const Content = ({ children, full, title, loading, error, actions }: ContentProps) => (
    <div className={`px-6 py-7 mx-auto ${full ? 'w-full px-10' : 'max-w-5xl'}`}>
        {(title || actions) && <div className="flex items-center mb-6">
            <h1 className="leading-tight text-3xl grow mb-0">{title}</h1>
            {actions}
        </div>}
        {loading && <Loader active inline="centered" className="!my-20" />}
        {(!loading && error) && <div className="px-3 py-6 md:py-3 mb-6 last:mb-0 border rounded-lg transition-colors duration-150 bg-red-500 border-red-500 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">{error}</div>
        </div>}
        {(!loading && !error) && children}
    </div>
)

export default Content;