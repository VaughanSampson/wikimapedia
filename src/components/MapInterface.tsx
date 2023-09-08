import {   ReactElement, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";
import GetGeocodeData from '../api/GetGeocodeData';
import GetWikipediaData, {WikipediaResultsSummary} from '../api/GetWikipediaData';
import './map-interface.css'; 

export default function MapInterface(){  
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (googleMapsApiKey === undefined) {
        return <div>Error</div>;
    }
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey,
    }); 

    if (!isLoaded) return <div>Loading...</div>;
    return <Map/>; 
}

function Map(){  
    const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLng | null>(null);  
    const [fetchedData, setFetchedData] = useState<ReactElement | undefined>(<p>Loading.</p>) 

    const geocoder = new google.maps.Geocoder();  

    async function GetInfoWindowContent(geocoder: google.maps.Geocoder,  latLng: google.maps.LatLng | null){ 
        if( latLng == null) return;  
        const geocodeText: string | undefined = await GetGeocodeData(geocoder, latLng);
        if(geocodeText != undefined)
        { 
            const wikipediaResults: WikipediaResultsSummary = await GetWikipediaData(geocodeText);
            if(wikipediaResults.success)
            {
                setFetchedData(
                <ol>
                    {
                        wikipediaResults.data?.map((d, i) => <li key={i}><a href={d.link} target="_blank"> {d.title}</a> </li>) 
                    } 
                    <p>{wikipediaResults.geocode}</p>
                </ol>
                );  
            }
            else
            {
                setFetchedData(<p> No results found for: {wikipediaResults.geocode}</p>);  
            }
        }
    } 
    
    const center = useMemo(() => ({ lat: 40.886518, lng: 65.0166301 }), []);
    
    return ( 
        <div>  
            <GoogleMap  
                id = "map"
                zoom={4} 
                
                center={center} 
                mapContainerClassName="map-container" 
                options={{
                    disableDoubleClickZoom:false,
                    clickableIcons:false
                }}
                onClick={ev => {
                    setFetchedData(<p>Researching...</p>);
                    GetInfoWindowContent(geocoder, ev.latLng);
                    setInfoWindowPosition(ev.latLng);
                }}
                >   
                { infoWindowPosition &&
                <InfoWindow onCloseClick={() => setInfoWindowPosition(null)} options={{ zIndex:1, position: infoWindowPosition, maxWidth: 320}} > 
                    <div>
                        {fetchedData}
                    </div>
                </InfoWindow>   
                } 
            </GoogleMap>   
        </div>
    ); 
}
