import { useMemo, useState } from "react";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";
import './map-interface.css'; 

export default function MapInterface(){  
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
    const [fetchedData, setFetchedData] = useState(<p>Loading.</p>) 

    const geocoder = new google.maps.Geocoder();
 
    const GetGeocodeData = (latLng: google.maps.LatLng | null) =>{
        if( latLng == null) return; 
        
        geocoder.geocode({ location: latLng })
        .then((response) => {
          if (response.results[0]) {
            console.log(response.results[0].formatted_address);
            setFetchedData(<p>{response.results[0].formatted_address}</p>) 
          } else {
            window.alert("No results found");
          }
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e));
    }   

    const center = useMemo(() => ({ lat: 38.886518, lng: -121.0166301 }), []);

    return ( 
        <div>  
            <GoogleMap  
                id = "map"
                zoom={10} 
                
                center={center} 
                mapContainerClassName="map-container" 
                options={{
                    disableDoubleClickZoom:false,
                    clickableIcons:false
                }}
                onClick={ev => {
                    GetGeocodeData(ev.latLng);
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
