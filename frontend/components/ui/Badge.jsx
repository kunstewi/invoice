import React from "react";
import { getStatusColor } from "../../src/utils/helper";

const Badge = ({ status, children, className = "" }) => {
    const colorClass = status ? getStatusColor(status) : "bg-gray-100 text-gray-800";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}
        >
            {children || status}
        </span>
    );
};

export default Badge;
