import React, { useState } from "react";
import "../styles/ConnectButton.css";
import jsonDatsa from "./sample.json";

export default function ConnectButton({ onNewDataFetch }) {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("");
    const [connected, setConnected] = useState(false);
    const [jsonData, setJsonData] = useState(null);

    const handleConnect = async () => {
        try {
            var sampleJson;
            // fetch('/sample.json')
            // .then((response) => {
            //     console.log(response)
            //     return response.json()})
            // .then((json) => setEventList(json["events"]));
            // setEventList(jsonDatsa["events"])
            // setMapBackgroundImage('./sample.jpg')
            onNewDataFetch(jsonDatsa["events"], {
                url: './sample.jpg',
                height: 2103,
                width: 2669
            }, null);

            // // Ensure the URL format is correct
            // const backendUrl = new URL('user_data', 'http://localhost:5000');
            // backendUrl.searchParams.append('url', encodeURI(url));
            // const response = await fetch(backendUrl, {
            //     method: 'GET',
            //     body: new URLSearchParams({ url: encodeURI(url) })
            // })

            // if (response.ok) {
            //     const data = await response.json();
            //     setConnected(true);
            //     setStatus("Connected successfully!");

            //     const events = await fetch(data.events)
            //     setEventList(events)

            //     const image = await fetch(data.image)
            //     const imageBlob = await fetch(image.blob())
            //     setMapBackgroundImage(URL.createObjectURL(imageBlob))

            //     setCustomUserData(data.customUserData)


            //     // // Fetch and store JSON data
            //     // const jsonResponse = await fetch(data.json_url);
            //     // const jsonFetchedData = await jsonResponse.json();
            //     // setJsonData(jsonFetchedData);

            //     // // Calculate the dataset length and add it to details
            //     // const totalDatasets = jsonFetchedData.length;
            //     // setDetails({
            //     //     ...data,
            //     //     totalDatasets,  // Set the total dataset count here
            //     // });

            //     // // Process t_min and t_max values from stored JSON data
            //     // const allTMin = jsonFetchedData.map(item => item.t_min[0]);
            //     // const allTMax = jsonFetchedData.map(item => item.t_max[0]);

            //     // const lowestTMin = allTMin.reduce((min, t) => t < min ? t : min, allTMin[0]);
            //     // const highestTMax = allTMax.reduce((max, t) => t > max ? t : max, allTMax[0]);

            //     // setTMinMax({ t_min: lowestTMin, t_max: highestTMax });
            //     // setEventData(jsonFetchedData);

            //     // // Fetch and store image data
            //     // const imageResponse = await fetch(data.image_url);
            //     // if (imageResponse.ok) {
            //     //     const imageBlob = await imageResponse.blob();
            //     //     const imageObjectURL = URL.createObjectURL(imageBlob);
            //     //     setImageData(imageObjectURL); // Set the image data using setImageData
            //     // } else {
            //     //     console.error("Failed to fetch the image.");
            //     // }

            //     // // Fetch and store geojson data
            //     // const geojsonResponse = await fetch(data.geojson_url);
            //     // if (geojsonResponse.ok) {
            //     //     const geojsonData = await geojsonResponse.json();
            //     //     setGeoJsonData(geojsonData);
            //     //     console.log("GeoJSON data fetched and set:", geojsonData);
            //     // } else {
            //     //     console.error("Failed to fetch the geojson.");
            //     // }
                
            // } else {
            //     setStatus("Connection unsuccessful! Status code: " + response.status);
            // }
        } catch (error) {
            console.error("Fetch error:", error);
            setStatus("Connection error: " + error.message);
        }
    };

    const handleReset = () => {
        setUrl("");
        setStatus("");
    }

    return (
        <>
            {connected ? (
                <div className="connected-container">
                    <p>{status}</p>
                    <span className="close-icon" onClick={handleReset}>✖</span>
                </div>
            ) : (
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter the URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="input-field"
                    />
                    <button 
                        onClick={handleConnect} 
                        disabled={!url}
                        className="connect-button"
                    >
                        Connect
                    </button>
                    <p>{status}</p>
                </div>
            )}
        </>
    );
}
