import { useState, FC} from "react";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";
import './map-interface.css'

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

const MapInfoWindow = (props: {latLng : google.maps.LatLng | null}) =>
{
    if(props.latLng == null) return <></>;

    return ( 
        <InfoWindow  options={{ zIndex:1, position: props.latLng, maxWidth: 320}} > 
            <p>
                A tree needs to be your friend if you're going to paint him. The only
                prerequisite is that it makes you happy. If it makes you happy then
                it's good. I thought today we would do a happy little picture. This
                present moment is perfect simply due to the fact you're experiencing
                it. Work on one thing at a time. Don't get carried away - we have
                plenty of time. I really believe that if you practice enough you could
                paint the 'Mona Lisa' with a two-inch brush.
            </p>
        </InfoWindow>   
    );
}
 