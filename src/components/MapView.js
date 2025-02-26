// Importing necessary libraries and components
import React from "react"; // Import React for creating components and using hooks
import { MapContainer, ImageOverlay, GeoJSON, LayersControl } from "react-leaflet"; // Import Leaflet components for rendering the map and layers
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS for map styling
import L from "leaflet"; // Import Leaflet library to access its utility methods

// Define the MapView component, which takes various props
export default function MapView({
  isConnected, // Flag to check if the backend connection is successful
  imageData, // URL of the image to overlay on the map
  geoJsonData, // GeoJSON data for rendering features on the map
  eventColors, // Object mapping event types to colors for styling
  eventData, // Array of all events
  filteredEvents, // Array of filtered events to display
}) {
  // Hook to handle side effects such as logging or data preparation
  React.useEffect(() => {
    if (geoJsonData) {
      console.log("GeoJSON Data:", geoJsonData); // Log GeoJSON data for debugging
      const geoJsonBounds = L.geoJSON(geoJsonData).getBounds(); // Compute bounds of the GeoJSON features
      console.log("GeoJSON Extent:", geoJsonBounds); // Log the computed bounds
    } else {
      console.warn("geoJsonData is null or undefined."); // Warn if GeoJSON data is not available
    }

    // Log the filtered events array
    console.log("Filtered Events:", filteredEvents);
    filteredEvents.forEach((event) => {
      console.log("Event object_id:", event.object_id); // Log each event's object_id
    });

    // Log the entire eventData array
    console.log("Event Data:", eventData);
  }, [geoJsonData, eventData, filteredEvents]); // Re-run the effect if these dependencies change

  // Display a message if the map cannot be rendered due to missing connection or data
  if (!isConnected || !imageData) {
    return <div>Map is not available.</div>;
  }

  // Define the image's dimensions (width and height in pixels)
  const imageWidth = 2669;
  const imageHeight = -2103; // Negative to flip the coordinates

  // Define bounds for the image overlay using pixel-based coordinates
  const bounds = [
    [imageHeight, 0], // Bottom-left corner
    [0, imageWidth], // Top-right corner
  ];

  console.log("Flipped Image Bounds:", bounds); // Log the bounds for debugging

  // Helper function to extract GeoJSON features corresponding to specific events
  const getFeaturesFromEvents = (events) => {
    return (
      geoJsonData?.features.filter((feature) =>
        events.some((event) => event.object_id === feature.properties.object_id) // Match features by object_id
      ) || [] // Return an empty array if no features match
    );
  };

  // Use filtered events if available; otherwise, fallback to all events
  const filteredGeoJsonData = filteredEvents.length
    ? getFeaturesFromEvents(filteredEvents)
    : getFeaturesFromEvents(eventData);

  console.log("Filtered GeoJSON Data:", filteredGeoJsonData); // Log the filtered GeoJSON data

  // Define the style for GeoJSON features based on event type
  const geoJsonStyle = (feature) => {
    const eventType = feature.properties.event_type; // Get the event type from feature properties
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
    const { object_id, event_type, parent_object_id } = feature.properties; // Extract feature properties

    const event = eventData.find((event) => event.object_id === object_id); // Find the event corresponding to this feature
    const changeMagnitudesAvg = event ? event.change_magnitudes_avg : "N/A"; // Get the average change magnitude or default to "N/A"

    // Create popup content for the feature
    let popupContent = `
      <strong>Object ID:</strong> ${object_id}<br/>
      <strong>Event Type:</strong> ${event_type}<br/>
      <strong>Change Magnitudes Avg:</strong> ${changeMagnitudesAvg}
    `;

    if (parent_object_id) {
      const parentEvent = eventData.find(
        (event) => event.object_id === parent_object_id
      ); // Find the parent event if it exists
      const parentChangeMagnitudesAvg = parentEvent
        ? parentEvent.change_magnitudes_avg
        : "N/A"; // Get the parent's change magnitude or default
      popupContent += `
        <br/><strong>Parent Object ID:</strong> ${parent_object_id}<br/>
        <strong>Parent Change Magnitudes Avg:</strong> ${parentChangeMagnitudesAvg}
      `;
    }

    layer.bindPopup(popupContent); // Bind the popup to the layer

    if (parent_object_id) {
      layer.on("click", function () {
        layer.bringToFront(); // Ensure the clicked feature is brought to the front
      });
    }
  };

  // Define options for the GeoJSON layer, including style and behavior
  const geoJsonOptions = {
    crs: L.CRS.Simple, // Use a simple CRS for pixel-based coordinates
    style: geoJsonStyle, // Apply the style function
    onEachFeature: onEachFeature, // Apply the behavior function
  };

  // Render the MapContainer with the ImageOverlay and GeoJSON layers
  return (
    <MapContainer
      center={[imageHeight / 2, imageWidth / 2]} // Center the map on the image
      zoom={0} // Set initial zoom level
      style={{ height: "100%", width: "100%" }} // Make the map take up full space
      crs={L.CRS.Simple} // Use a simple CRS for pixel coordinates
      scrollWheelZoom={false} // Disable zooming with the mouse wheel
    >
      {/* Add layer controls to the top right */}
      <LayersControl position="topright">
        {/* Base layer: Image overlay */}
        <LayersControl.BaseLayer checked name="Image Layer">
          <ImageOverlay url={imageData} bounds={bounds} opacity={0.9} />
        </LayersControl.BaseLayer>

        {/* Overlay layer: GeoJSON polygons */}
        {filteredGeoJsonData.length > 0 && (
          <LayersControl.Overlay checked name="Polygon Features">
            <GeoJSON
              key={JSON.stringify(filteredGeoJsonData)} // Unique key for re-rendering
              data={{ type: "FeatureCollection", features: filteredGeoJsonData }}
              {...geoJsonOptions} // Apply GeoJSON options
            />
          </LayersControl.Overlay>
        )}
      </LayersControl>
    </MapContainer>
  );
}
