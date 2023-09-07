import { useState, FC} from "react";
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
    return <Map  />; 
}

function Map(){  
    const [infoWindow, setInfoWindow] = useState<any>(null);  
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

    
    const MapInfoWindow = (props: {latLng : google.maps.LatLng | null}) =>
    {
        if(props.latLng == null) return <></>; 

        return ( 
            <InfoWindow  options={{ zIndex:1, position: props.latLng, maxWidth: 320}} > 
                <div  id = "infoWindowContent">
                    {fetchedData}
                </div>
            </InfoWindow>   
        );
    }
    

    return ( 
        <div>  
            <GoogleMap  
            id = "map"
            zoom={10} 
            center={{lat: -34.397, lng: 150.644}} 
            mapContainerClassName="map-container" 
            options={{
                disableDoubleClickZoom:false,
                clickableIcons:false
            }}
            onClick={ev => {
                GetGeocodeData(ev.latLng);
                setInfoWindow(<MapInfoWindow latLng={ev.latLng} />);
            }}
            >  

            {
            infoWindow
            }

            </GoogleMap>   
        </div>
    );
  

}
