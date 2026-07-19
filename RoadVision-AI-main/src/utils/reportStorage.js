const STORAGE_KEY = 'roadpulse_custom_reports';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const loadCustomReports = () => {
    if (!canUseStorage()) return [];

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const saveCustomReports = (reports) => {
    if (!canUseStorage()) return;

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch {
        // Ignore storage failures so the UI keeps working.
    }
};

export const appendCustomReport = (report) => {
    const current = loadCustomReports();
    const next = [report, ...current];
    saveCustomReports(next);
    return next;
};