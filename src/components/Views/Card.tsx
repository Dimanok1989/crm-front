import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    //
}

const Card: React.FC<CardProps> = ({ children, className }) => {
    return <div className={`px-5 py-4 bg-white rounded-lg border border-gray-100 shadow-lg shadow-gray-100 ${className}`}>
        {children}
    </div>
}

export default Card;