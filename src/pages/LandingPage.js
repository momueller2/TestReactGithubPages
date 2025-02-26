import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, FormControlLabel, Paper } from '@mui/material';
import '../styles/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState([]);
  
  const modules = [
    { id: 'ConnectButton', label: 'Connect Button', disabled: true },
    { id: 'Calendar', label: 'Calendar' },
    { id: 'Graph', label: 'Graph' },
    { id: 'Legend', label: 'Legend' },
    { id: 'MapView', label: 'Map View' },
  ];

  const handleToggle = (moduleId) => (e) => {
    if (moduleId === 'ConnectButton') return;
    const newModules = e.target.checked
      ? [...selectedModules, moduleId]
      : selectedModules.filter((id) => id !== moduleId);
    setSelectedModules(newModules);
  };

  const handleGo = () => {
    navigate('/dashboard', { state: { selectedModules } });
  };

  return (
    <div className="landing-container">
      <h1 className="welcome-heading">
        Welcome to <span className="welcome-4d">4D</span>
        <span className="welcome-geo">Geo</span>
      </h1>
      
      <Paper className="landing-paper">
        <h2 className="select-modules-heading">Select Dashboard Modules</h2>
        
        <div className="modules-container">
          {modules.map((module) => (
            <div className="module-item" key={module.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedModules.includes(module.id)}
                    onChange={handleToggle(module.id)}
                    disabled={module.disabled}
                    color="primary"
                  />
                }
                label={module.label}
              />
            </div>
          ))}
        </div>

        <div className="button-container">
          <Button
            variant="contained"
            className="go-button"
            onClick={handleGo}
          >
            GO TO DASHBOARD
          </Button>
        </div>

        <p className="note-text">
          Note: Connect Button is required and always enabled
        </p>
      </Paper>
    </div>
  );
}

export default LandingPage;