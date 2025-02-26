import React from 'react';
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ConnectButton from '../components/ConnectButton.js';
import Calendar from '../components/Calendar.js';
import Graph from '../components/Graph.js';
import Legend from '../components/Legend.js';
import MapView from '../components/MapView.js';

function DashboardPage() {
  const location = useLocation();
  const selectedModules = location.state?.selectedModules || ['ConnectButton'];
  
  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [tMinMax, setTMinMax] = useState({ t_min: null, t_max: null });
  const [eventData, setEventData] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Determine visible components
  const showCalendar = selectedModules.includes('Calendar');
  const showGraph = selectedModules.includes('Graph');
  const showLegend = selectedModules.includes('Legend');
  const showMapView = selectedModules.includes('MapView');

  // Event handlers
  const handleConnectionStatus = (status) => {
    setIsConnected(status);
  };

  const handleDateRangeChange = (fromDate, toDate) => {
    setDateRange({ fromDate, toDate });
    setSelectedFromDate(fromDate);
    setSelectedToDate(toDate);
  };

  // Debug effects
  React.useEffect(() => {
    if (geoJsonData) {
      console.log("GeoJSON Data successfully set:", geoJsonData);
    }
  }, [geoJsonData]);

  React.useEffect(() => {
    console.log("Event Data:", eventData);
  }, [eventData]);

  React.useEffect(() => {
    console.log("t_min:", tMinMax.t_min);
    console.log("t_max:", tMinMax.t_max);
  }, [tMinMax]);

  // Define colors for event types
  const eventColors = {
    Rockfall: '#ffb400',
    Debrisflow: '#6F4E37',
    Vegetation: '#3b8045',
    undefined: '#7e3b80',
  };

  return (
    <Box sx={{ height: '100vh', padding: 2, display: 'flex', flexDirection: 'column' }}>
      <header>
        <h1>Dashboard</h1>
      </header>
      

      {/* Top Section: Connect Button and Calendar */}
      <Grid container spacing={2} sx={{ flexShrink: 0 }}>
        <Grid item xs={showCalendar ? 4 : 12}>
          <Paper elevation={3} sx={{ padding: 2, height: '50px' }}>
            <ConnectButton 
              onConnectionChange={handleConnectionStatus}
              setTMinMax={setTMinMax}
              setEventData={setEventData}
              setImageData={setImageData}
              setGeoJsonData={setGeoJsonData}
            />
          </Paper>
        </Grid>
        {showCalendar && (
          <Grid item xs={8}>
            <Paper elevation={3} sx={{ padding: 2, height: '50px' }}>
              <Calendar 
                isConnected={isConnected}
                eventData={eventData}
                onDateRangeChange={handleDateRangeChange}
                selectedFromDate={selectedFromDate}
                selectedToDate={selectedToDate}
              />
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Main Section: Left (Graph + Legend) and Right (Map) */}
      <Grid container spacing={2} sx={{ flexGrow: 1, marginTop: 2 }}>
        {/* Left Column */}
        {(showGraph || showLegend) && (
          <Grid item xs={showMapView ? 4 : 12} container direction="column" spacing={5}>
            {showGraph && (
              <Grid item sx={{ height: showLegend ? '62%' : '100%' }}>
                <Paper elevation={3} sx={{ height: '100%', padding: 2 }}>
                  <Graph 
                    isConnected={isConnected}
                    t_min={tMinMax.t_min}
                    t_max={tMinMax.t_max}
                    eventData={eventData}
                    dateRange={dateRange}
                    setFilteredEvents={setFilteredEvents}
                  />
                </Paper>
              </Grid>
            )}
            {showLegend && (
              <Grid item sx={{ height: showGraph ? '32%' : '100%' }}>
                <Paper elevation={3} sx={{ height: '100%', padding: 2 }}>
                  <Legend 
                    isConnected={isConnected}
                    colors={eventColors}
                  />
                </Paper>
              </Grid>
            )}
          </Grid>
        )}

        {/* Right Column */}
        {showMapView && (
          <Grid item xs={showGraph || showLegend ? 8 : 12}>
            <Paper elevation={3} sx={{ height: '94%', padding: 2 }}>
              <MapView 
                isConnected={isConnected}
                imageData={imageData}
                eventData={eventData}
                geoJsonData={geoJsonData}
                eventColors={eventColors}
                filteredEvents={filteredEvents}
              />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default DashboardPage;