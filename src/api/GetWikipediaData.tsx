 
async function GetWikipediaData (location: string) {
  
  const locationStringArray = location.split(' ');
 
  while(locationStringArray.length > 1){

    locationStringArray.shift();  
    const queryText = locationStringArray.reduce((acc,cur) => acc+"%20"+cur);  

    //await GetGoogleSearchData(queryText); 

    const res = await FetchResultFromWikipediaAPI(queryText); 
    
    if (res == undefined) continue;
    const json = await res; 
    const hits = json["query"]["search"]; 

    if (JSON.stringify(hits) !== '[]'){
      return CreateListOfWikipediaResults(hits, location);
    }
  }
  
  return{
    success: false,
    geocode: location, 
    data: null
  } 
}  

function CreateListOfWikipediaResults(hits: any[], location: string): WikipediaResultsSummary{
  return {
    success: true,
    geocode: location,
    data: hits.map(hit => {
    const title: string = hit["title"]; 
    const link: string = "https://en.wikipedia.org/?curid=" + JSON.stringify(hit["pageid"]);
    return {
      title: title, 
      link: link,
    } 
  })

  }
}

async function FetchResultFromWikipediaAPI(queryText: string){ 
  return await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+queryText+"%20location"+"&format=json&formatversion=2&origin=*")
  .then((response) => { 
    return response.json(); 
  })
  .catch((e) => window.alert("Wikipedia request failed: " + e)); 
}
 

export type WikipediaResultsSummary = 
{ 
  success: boolean,
    geocode: string,
  data: {
    title: string, 
    link: string
  }[] | null
}  

export default GetWikipediaData;