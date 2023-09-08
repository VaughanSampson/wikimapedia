# Wikimapedia
**Wikimapedia** utlises the [Google Maps](https://developers.google.com/maps) and [Mediawiki](https://www.mediawiki.org/wiki/API:Main_page) APIs to display Wikipedia articles based at user selected geographical locations. The user clicks on any point on the map and will get results related to the address selected.

## Requirement to run
The user will have to use a Google Maps API key to run the web application. This key should be an environmental variable, listed in a file in the root folder called '.env.local' in the format `VITE_GOOGLE_API_KEY=<API KEY HERE>`.
