# Wikimapedia
https://vaughansampson.github.io/wikimapedia/

**Wikimapedia** utlises the [Google Maps](https://developers.google.com/maps) and [Mediawiki](https://www.mediawiki.org/wiki/API:Main_page) APIs to display Wikipedia articles based at user selected geographical locations. The user clicks on any point on the map and will get results related to the address selected.


https://github.com/VaughanSampson/wikimapedia/assets/128713660/9572d7cc-b49b-437b-b67b-783a8cd150b2


## Requirement to run
The user will have to use a Google Maps API key to run the web application. The API requiring this key is used to display the map and also to use reverse geocoding to access the address of the selected location. This key should be stored as a local environmental variable, listed in a file in the root folder called '.env.local' in the format `VITE_GOOGLE_API_KEY=<API KEY HERE>`.
