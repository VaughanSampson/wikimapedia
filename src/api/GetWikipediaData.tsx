
async function GetWikipediaData (location: string) {
  
  const locationStringArray = location.split(' ');
 
  while(locationStringArray.length > 2){
    locationStringArray.shift(); 

    const queryText = locationStringArray.reduce((acc,cur) => acc+"%20"+cur);  
    const res = await FetchData(queryText); 
    
    if (res == undefined) continue;
    const json = await res; 
    const hits = json["query"]["search"]; 

    if (JSON.stringify(hits) !== '[]'){ 
      const title: string = hits[0]["title"]; 
      const link: string = "https://en.wikipedia.org/?curid=" + JSON.stringify(hits[0]["pageid"]);
      return {
        success: true,
        title: title, 
        link: link,
        geocode: location
      }
    }
  }
  
  return{
    success: false,
    title: "None",
    link: "",
    geocode: location
  } 
 
}  

async function FetchData(queryText: string){

  return await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+queryText+"&format=json&formatversion=2&origin=*")
  .then((response) => {
    console.log(response);
    return response.json(); 
  })
  .catch((e) => window.alert("Wikipedia request failed: " + e));

}
 
export type WikipediaSummary = 
{
  success: boolean,
  title: string, 
  link: string ,
  geocode: string
}  

export default GetWikipediaData;