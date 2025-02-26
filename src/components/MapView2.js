import { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, GeoJSON, LayersControl, Polygon, Rectangle, Circle } from "react-leaflet"; // Import Leaflet components for rendering the map and layers
import L from "leaflet"; // Import Leaflet library to access its utility methods
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS for map styling

export default function MapView2({ 
    allEventsList,
    eventColors, // Object mapping event types to colors for styling
    dateRange,
    backgroundImageData
 }) {
    const [filteredEventList, setFilteredEventList] = useState(allEventsList)


    const getFilteredEventList = () => {

        return Array.from(allEventsList).filter((event) => (event.startDate >= dateRange.startDate && event.startDate <= dateRange.endDate))
    }

    useEffect(() => {
        if (typeof dateRange == undefined || typeof dateRange == null) {
            setFilteredEventList(allEventsList)
        }
        var filteredEvents = getFilteredEventList();
        console.log("fil", filteredEventList)
        console.log("all", allEventsList)
        setFilteredEventList(filteredEvents);
    }, [dateRange]);

    useEffect(() => {
        setFilteredEventList(allEventsList)
    }, [allEventsList])


    console.log(backgroundImageData)
    // Display a message if the map cannot be rendered due to missing connection or data
    if (backgroundImageData == undefined) {
        return <div>Map is not available.</div>;
    }

    // Define the style for GeoJSON features based on event type
    const eventStyle = (event) => {
        const eventType = event.type;
        const color = eventColors[eventType] || eventColors.undefined; // Use the color for the event type or a default
        return {
            color: color, // Line color
            weight: 2, // Line thickness
            opacity: 1, // Line opacity
            fillOpacity: 0.5, // Fill opacity
        };
    };

    // Define behavior for each GeoJSON feature, including popup content
    const onEachFeature = (feature, layer) => {
        let popupContent = ''

        for (const [key, value] of Object.entries(feature.properties)) {
            popupContent += `<strong>${key}:</strong> ${value}<br/>`
        }

        layer.bindPopup(popupContent); // Bind the popup to the layer
    };

    const getEventGeometries = () => {
        console.log("dateRange before Geometry Rendering:", dateRange)
        return Array.from(filteredEventList).map((event, index) => {
            switch(event.geometry.type) {
                case 'Polygon':
                    console.log(event.geometry.type)
                    return (
                        <Polygon
                            key={index.toString()}
                            pathOptions={{ 
                                color: eventColors["event.type"],
                                weight: 2, // Line thickness
                                opacity: 1, // Line opacity
                                fillOpacity: 0.5, // Fill opacity
                            }}
                            positions={event.geometry.coordinates}
                        />
                    );
                case 'Circle':
                    return (
                        <Circle
                            key={index.toString()}
                            pathOptions={{ 
                                color: eventColors["event.type"],
                                weight: 2, // Line thickness
                                opacity: 1, // Line opacity
                                fillOpacity: 0.5, // Fill opacity
                            }}
                            positions={event.geometry.coordinates}
                        />
                    );
                case 'Rectangle':
                    return (
                        <Rectangle
                            key={index.toString()}
                            pathOptions={{ 
                                color: eventColors["event.type"],
                                weight: 2, // Line thickness
                                opacity: 1, // Line opacity
                                fillOpacity: 0.5, // Fill opacity
                            }}
                            positions={event.geometry.coordinates}
                        />
                    );
            }
        });
    }

    // Define the style for GeoJSON features based on event type
    const geoJsonStyle = (event) => {
        const eventType = event.type; // Get the event type from feature properties
        const color = eventColors[eventType] || eventColors.undefined; // Use the color for the event type or a default
        return {
            color: color, // Line color
            weight: 2, // Line thickness
            opacity: 1, // Line opacity
            fillOpacity: 0.5, // Fill opacity
        };
    };

    // Define options for the GeoJSON layer, including style and behavior
    const geoJsonOptions = {
        crs: L.CRS.Simple, // Use a simple CRS for pixel-based coordinates
        style: geoJsonStyle, // Apply the style function
        onEachFeature: onEachFeature, // Apply the behavior function
    };

    return (
        <MapContainer
            center={[(-backgroundImageData.height) / 2, backgroundImageData.width / 2]} // Center the map on the image
            crs={L.CRS.Simple}
            style={{ height: "100%", width: "100%" }} // Make the map take up full space
            zoom={0} // Set initial zoom level
            scrollWheelZoom={true} // Disable zooming with the mouse wheel
        >
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Image Layer">
                    <ImageOverlay
                        url={backgroundImageData.url}
                        bounds={
                            [[-backgroundImageData.height, 0], // Bottom-left corner
                            [0, backgroundImageData.width]] // Top-right corner
                        }
                        opacity={0.9}
                    />
                </LayersControl.BaseLayer>

                {/* Overlay layer: GeoJSON polygons */}
                {filteredEventList.length > 0 && (
                    <GeoJSON
                        key={JSON.stringify(filteredEventList)} // Unique key for re-rendering
                        data={filteredEventList.map((event) => {
                            return {
                                "type": "Feature",
                                "geometry": {
                                    "type": event.geometry.type,
                                    "coordinates": event.geometry.coordinates
                                },
                                "properties": event.customEventData
                            }
                        })}
                        {...geoJsonOptions} // Apply GeoJSON options
                    />
                    // <LayersControl.Overlay checked name="Events">
                    //     {getEventGeometries()}
                    // </LayersControl.Overlay>
                )}
            </LayersControl>
        </MapContainer>
    );
}