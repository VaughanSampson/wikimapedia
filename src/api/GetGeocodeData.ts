 

async function GetGeocodeData (geocoder: google.maps.Geocoder, 
    latLng: google.maps.LatLng ){
 
    const geotext = await geocoder.geocode({ location: latLng })
    .then((response) => {
      if (response.results[0]) {
        console.log(response.results[0].formatted_address);
        return response;
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
    
    if(geotext == undefined) return;

    return (geotext.results[0].formatted_address);
}    
    

export default GetGeocodeData;