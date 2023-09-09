import {   ReactElement, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";
import GetGeocodeData from '../api/GetGeocodeData';
import GetWikipediaData, {WikipediaResultsSummary} from '../api/GetWikipediaData';
import './map-interface.css'; 

/**
 * Makes a connection to the Google Maps API with a key stored as a 
 * local environment variable. Then uses that to get an interactive
 * Google Maps display
 * @returns A Google Maps display, utilising a the Google Maps React API
 */
export default function MapInterface(){  
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (googleMapsApiKey === undefined) {
        return <div>Error</div>;
    }
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey,
    }); 

    if (!isLoaded) return <div>Loading...</div>;
    return <MapDisplayElement/>; 
}

/**
 * Creates a Google Maps display which can be clicked on to
 * retrieve and display a list of up to ten Wikipedia pages
 * @returns A Google Maps display with info windows
 */
function MapDisplayElement(){  
    // State used to store where the single info window should be displayed
    const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLng | null>(null);  
    // State used to store the ReactElement which is to be displayed in the info window
    const [infoWindowContent, setInfoWindowContent] = useState<ReactElement | undefined>(<p>Loading.</p>) 
    // Create geocoder to be used for reverse geocoding
    const geocoder = new google.maps.Geocoder();  

    /**
     * Async function which fetches Wikipedia data to set the display state of the info window
     * @param geocoder geocoder instance to reverse geocode the address of the given coordinates
     * @param latLng coordinates to get data about
     */
    async function FetchAndSetInfoWindowContent(geocoder: google.maps.Geocoder,  latLng: google.maps.LatLng | null){ 
        // Ensures coordinates are not null
        if( latLng != null) {
            // Fetch address at the given coordinates
            const addressText: string | null = await GetGeocodeData(geocoder, latLng);

            // Ensures address is not null
            if(addressText != null) { 
                // Fetches information on Wikipedia article which pertain to the address
                const wikipediaResults: WikipediaResultsSummary = await GetWikipediaData(addressText);

                // Store relevant React element to be rendered by the Google Maps InfoWindow
                if(wikipediaResults.success) {
                    setInfoWindowContent(
                    <ol>
                        {wikipediaResults.data?.map((d, i) => <li key={i}><a href={d.link} target="_blank"> {d.title}</a> </li>)} 
                        <p>{wikipediaResults.geocode}</p>
                    </ol>
                    );  
                }
                else {
                    setInfoWindowContent(<p> No results found for: {wikipediaResults.geocode}</p>);  
                }
            }
        }
    } 
    
    // Memoize to maintain central position of Google Maps view
    const centerOfDisplay = useMemo(() => ({ lat: 40.886518, lng: 65.0166301 }), []);
    
    // Return React element for display
    return ( 
        <div>  
            <GoogleMap  
                id = "map"
                zoom={4}  
                center={centerOfDisplay} 
                mapContainerClassName="map-container" 
                options={{
                    disableDoubleClickZoom:false,
                    clickableIcons:false
                }}

                // Set the info window's location and content on click
                onClick={ev => {
                    setInfoWindowContent(<p>Researching...</p>);
                    FetchAndSetInfoWindowContent(geocoder, ev.latLng);
                    setInfoWindowPosition(ev.latLng);
                }} 
            >  
                { 
                // If infoWindowPosition is not null, display info window
                infoWindowPosition &&
                <InfoWindow onCloseClick={() => setInfoWindowPosition(null)} options={{ zIndex:1, position: infoWindowPosition, maxWidth: 320}} > 
                    <div> {infoWindowContent}  </div>
                </InfoWindow>   
                } 

            </GoogleMap>   
        </div>
    ); 
}
