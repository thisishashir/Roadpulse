import React from 'react';

const severityMap = {
    minor: { label: 'Minor', css: 'badge-minor' },
    moderate: { label: 'Moderate', css: 'badge-moderate' },
    severe: { label: 'Severe', css: 'badge-severe' },
    critical: { label: 'Critical', css: 'badge-critical' },
};

const statusMap = {
    reported: { label: 'Reported', css: 'badge-reported' },
    assigned: { label: 'Assigned', css: 'badge-assigned' },
    inprogress: { label: 'In Progress', css: 'badge-inprogress' },
    repaired: { label: 'Repaired', css: 'badge-repaired' },
};

export const SeverityBadge = ({ severity }) => {
    const m = severityMap[severity] || { label: severity, css: '' };
    return <span className={`badge ${m.css}`}><span className={`sev-dot ${severity}`} />{m.label}</span>;
};

export const StatusBadge = ({ status }) => {
    const m = statusMap[status] || { label: status, css: '' };
    return <span className={`badge ${m.css}`}>{m.label}</span>;
};

export default SeverityBadge;
