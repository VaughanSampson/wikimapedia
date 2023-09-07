
async function GetWikipediaData (location: string) {
  
  const locationStringArray = location.split(' ');
  locationStringArray.shift(); 
  const queryText = locationStringArray.reduce((acc,cur) => acc+"%20"+cur);

  console.log("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+queryText+"&format=json&formatversion=2&origin=*");

  const res = await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+queryText+"&format=json&formatversion=2&origin=*" )
  .then((response) => {
    console.log(response);
    return response.json(); 
  })
  .catch((e) => window.alert("Wikipedia request failed: " + e));

  if(res == undefined) return "";
  const json:JSON = await res;
  return JSON.stringify(json);
 
}     

export default GetWikipediaData;