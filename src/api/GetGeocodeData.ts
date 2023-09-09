 
/**
 * Async function to retrieve reverse geocoded address
 * @param geocoder Instance of Google Maps geocoder
 * @param latLng Coordinates to reverse geocode
 * @returns A promise which resolves in a string address from the given coordinates
 */
export default async function GetGeocodeData (geocoder: google.maps.Geocoder, 
    latLng: google.maps.LatLng ){
 
    const geotext = await geocoder.geocode({ location: latLng })
    .then((response) => {
      if (response.results[0]) {
        return response;
      } else {
        window.alert("No address results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
    
    if(geotext == undefined) return null;

    return (geotext.results[0].formatted_address);
}     