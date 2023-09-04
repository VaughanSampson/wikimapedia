import { useMemo } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import './map-interface.css'

export default function MapInterface(){
     
    /*
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (googleMapsApiKey === undefined) {
        return <div>Error</div>;
    }  \
    */

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: /*googleMapsApiKey,*/ "AIzaSyBteKDQytB8p7Y4MAZikPM4Ou-t2sHxj-Y",
    }); 

    if (!isLoaded) return <div>Loading...</div>;
    return <Map  />; 
}

function Map(){    
    return ( 
        <div>  
            <GoogleMap  
            zoom={10} 
            center={{lat:44, lng:-80}} 
            mapContainerClassName="map-container"
            ></GoogleMap>   
        </div>
    );
}

type MapProps = {
    googleMapsApiKey: string;
  };

 