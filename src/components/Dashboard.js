import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Graph from "./Graph";
import Calendar2 from "./Calendar2";
import Legend from "./Legend";
import MapView2 from "./MapView2";
import _ from "lodash";
import "../styles/Dashboard.css"

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard({ customizeLayoutMode, selectedModules, userDataEvents, backgroundImageData, customUserData }) {
    const moduleSizes = new Map([
        ["Calendar", {w: 3, h: 1}],
        ["Graph", {w: 2, h: 2}],
        ["Legend", {w: 2, h: 2}],
        ["MapView", {w: 6, h: 3}],
    ])
    
    const generateLayout = () => {
        return _.map(Array.from(selectedModules), function(moduleName, i) {
            return {
                x: (i * 2) % 12,
                y: Math.floor(i / 6),
                w: moduleSizes.get(moduleName.toString()).w,
                h: moduleSizes.get(moduleName.toString()).h,
                i: i.toString()
            };
        });
    };

    
    //State Management
    const [dateRange, setDateRange] = useState({ startDate: Date.parse("1979-01-01T00:00:00Z"), endDate: Date.now()});
    const [layout, setLayout] = useState(generateLayout())

    const onLayoutChange = (newLayout) => {
        setLayout(newLayout);
    }

    const handleDateRangeChange = (fromDate, toDate) => {
        setDateRange({ fromDate, toDate });
    };

    // Define colors for event types
    const eventColors = {
        Rockfall: '#ffb400',
        Debrisflow: '#6F4E37',
        Vegetation: '#3b8045',
        undefined: '#7e3b80',
    };

    const generateDOM = () => {
        return Array.from(selectedModules).map((moduleName, i) => {
            switch(moduleName) {
                case 'Calendar':
                    return (
                        <div
                            className="reactGridItem"
                            key={i.toString()}
                            data-grid={{    
                                x: layout[i].x,
                                y: layout[i].y,
                                w: layout[i].w,
                                h: layout[i].h,
                                i: layout[i].i,
                                minW: 2,
                                minH: 1,
                                isDraggable: customizeLayoutMode,
                                isResizable: customizeLayoutMode,
                            }}
                        >
                            <Calendar2 
                                className="bg-white h-full border border-amber-700 shadow-md w-full"
                                eventList={userDataEvents}
                                onDateRangeChange={handleDateRangeChange}
                            />
                        </div>
                    )
                    
                    
                case 'Graph':
                    return (
                        <div
                            className="reactGridItem"
                            key={i}
                            data-grid={{   
                                w: layout[i].w,
                                x: layout[i].x,
                                y: layout[i].y,
                                h: layout[i].h,
                                i: layout[i].i,
                                minW: 2,

                                minH: 2,           
                                isDraggable: customizeLayoutMode,
                                isResizable: customizeLayoutMode,
                            }}
                        >
                           <Graph 
                                eventData={userDataEvents}
                                dateRange={dateRange}
                            />
                        </div>
                    );
                case 'Legend':
                    return (
                        <div
                            className="reactGridItem"
                            key={i}
                            data-grid={{   
                                x: layout[i].x,
                                y: layout[i].y,
                                w: layout[i].w,
                                h: layout[i].h,
                                i: layout[i].i,
                                minW: 2,

                                minH: 2,           
                                isDraggable: customizeLayoutMode,
                                isResizable: customizeLayoutMode,
                            }}
                        >
                           <Legend 
                                colors={eventColors}
                            />
                        </div>
                    );
                case 'MapView':
                    return (
                        <div
                            className="reactGridItem"
                            key={i.toString()}
                            data-grid={{
                                x: layout[i].x,
                                y: layout[i].y,
                                w: layout[i].w,
                                h: layout[i].h,
                                i: layout[i].i,
                                minW: 6,

                                minH: 3,  
                                isDraggable: customizeLayoutMode,
                                isResizable: customizeLayoutMode,
                            }}
                        >
                           <MapView2 
                                className="mapview"
                                allEventsList={userDataEvents}
                                eventColors={eventColors}
                                dateRange={dateRange}
                                backgroundImageData={backgroundImageData}
                            />
                        </div>
                    );
            }
        })
    }


    return (
        <ResponsiveGridLayout
            layout={layout}
            onLayoutChange={onLayoutChange}
            className= "layout"
        >
            {generateDOM()}
        </ResponsiveGridLayout>
    );
};

export default Dashboard