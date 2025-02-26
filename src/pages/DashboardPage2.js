import { useLocation } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import ConnectButton from "../components/ConnectButton";
import { useState } from "react";
import Box from '@mui/material/Box';
import { Switch } from "@mui/material";

function DashboardPage2() {
    const location = useLocation();
    const selectedModules = location.state?.selectedModules || ['ConnectButton'];

    //State management
    const [isConnected, setIsConnected] = useState(false);
    const [eventList, setEventList] = useState([]);
    const [backgroundImageData, setBackgroundImageData] = useState(null);
    const [customUserData, setCustomUserData] = useState(null);
    const [customizeLayoutMode, setCustomizeLayoutMode] = useState(true)

    const onNewDataFetch = (newEventList, mapBackgroundImage, customUserData) => {
        setEventList(newEventList);
        setBackgroundImageData(mapBackgroundImage);
        setCustomUserData(customUserData);
    };

    return (
        <Box sx={{ height: '100vh', padding: 2, display: 'flex', flexDirection: 'column' }}>
            <header>
                <h1>Dashboard</h1>

                <ConnectButton 
                    onNewDataFetch={onNewDataFetch}
                />

                <Switch
                    checked={customizeLayoutMode}
                    onChange={(event) => setCustomizeLayoutMode(event.target.checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </header>

            <Dashboard
                selectedModules={selectedModules}
                customizeLayoutMode={customizeLayoutMode}
                userDataEvents={eventList}
                backgroundImageData={backgroundImageData}
                customUserData={customUserData}
            />
        </Box>
    )
}

export default DashboardPage2;