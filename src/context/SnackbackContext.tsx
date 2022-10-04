import {Alert, Snackbar } from "@mui/material";
import {createContext, PropsWithChildren, useContext, useEffect, useRef, useState} from "react";


type  AlertType = "success" | "error" | "warning" | "info";

interface SnackbarContextType {
    addAlert: (text: string, type?: AlertType) => void
}

interface AlertStateType {
    text: string,
    type: AlertType
}

const SnackbarContext = createContext<SnackbarContextType>(undefined!);

export const useSnackbar = () => useContext(SnackbarContext);

export default function SnackbarContextProvider({children}: PropsWithChildren<{}>){
    const [alerts, setAlerts] = useState<AlertStateType[]>([]);
    const alertsRef = useRef(alerts);

    const addAlert = (text: string, type: AlertType = "success") => {
        setAlerts(prev => ([...prev, {text, type}]));
        setTimeout(() => {
            setAlerts(alertsRef.current.filter(alert => alert.text !== text))
        }, 3000);
    };

    useEffect(() => {
        alertsRef.current = alerts;
    },[alerts]);

    return (
        <SnackbarContext.Provider value={{addAlert}}>
            {children}
            {alerts.map((alert,index) => (
                <Snackbar
                    key={index}
                    style={{marginBottom: `${index*4}em`}}
                    open
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <Alert severity={alert.type}>{alert.text}</Alert>
                </Snackbar>
            ))}
        </SnackbarContext.Provider>
    );
}
