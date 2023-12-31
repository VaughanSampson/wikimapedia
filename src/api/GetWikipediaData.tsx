/**
 * Async function to get Wikipedia data based on address string
 * @param address Address string to query Wikipedia over
 * @returns A promise which resolves in a WikipediaResultsSummary of Wikipedia pages
 */
export default async function GetWikipediaData (address: string) {
  
  // Split the address into components to filter those components
  const addressStringArray = address.split(' ');
 
  // Loop to keep cutting down on the array until a query is successful or the array is too small to cut
  while(addressStringArray.length > 1){
    // Cut first part of the address to remove excess
    addressStringArray.shift();  

    // Combine the address array into a string appropriate for a Wikipedia query
    const queryText = addressStringArray.reduce((acc,cur) => acc+"%20"+cur);  
 
    // Do Wikipedia query
    const res = await FetchResultFromWikipediaAPI(queryText); 
    
    // If there is no result, continue to skip next steps
    if (res == undefined) continue;
    const json = await res; 
    const hits = json["query"]["search"]; 
    
    // Ensure there were query results
    if (JSON.stringify(hits) !== '[]'){
      return GenerateSummaryOfSuccessfulQuery(hits, address);
    }
  }
  
  // If there were no successful query results, return a failure
  return{ 
    geocode: address, 
    data: null
  } 

  /**
   * Generates a WikipediaResultsSummary from a successful Wikipedia query (with minimum 1 result)
   * @param hits Successful JSON results of Wikipedia query 
   * @param address Address used for Wikipedia query
   * @returns WikipediaResultsSummary object of up to 10 successful query results
   */
  function GenerateSummaryOfSuccessfulQuery(hits: Hit[], address: string): WikipediaResultsSummary{
    return { 
      geocode: address,
      data: hits.map(hit => { 
        return {
          title: hit.title, 
          pageid: hit.pageid,
        };
    })}
  }

  /**
   * Fetches data from Wikipedia API
   * @param queryText String to search for Wikipedia pages over
   * @returns Promise which resolves in fetched JSON
   */
  async function FetchResultFromWikipediaAPI(queryText: string){ 
    return await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+queryText+"%20location&format=json&formatversion=2&origin=*")
    .then((response) => { 
      return response.json(); 
    })
    .catch((e) => window.alert("Wikipedia request failed: " + e)); 
  }
}   
 
/**
 * Interface of a set of Wikipedia results.
 */
export interface WikipediaResultsSummary
{  
  geocode: string,
  data: {
    title: string, 
    pageid: string
  }[] | null
}  
 
 
/**
 * Interface of a single successfully found Wikipedia result.
 */
export interface Hit
{  
  title: string,
  pageid: string
}  
 