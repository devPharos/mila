

import React, { createContext, useContext, useState } from 'react';

export const DashboardContext = createContext([]);

function DashboardProvider({ children }) {
    const [dashboard, setDashboard] = useState({ data: {}, fromDate: new Date() });
    async function updateDashboard(data) {
        setDashboard({...dashboard, data, fromDate: new Date()})
    }
    return (
        <DashboardContext.Provider value={{dashboard, updateDashboard}}>
            { children }
        </DashboardContext.Provider>
    )
}

function useDashboard() {
    const context = useContext(DashboardContext);

    return context
}

export { DashboardProvider, useDashboard }