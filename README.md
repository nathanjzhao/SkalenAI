# Project for Stanford's Big Earth Wildfire Hackathon

Utilizing geotagging and graph theory to detect fires early. In this preliminary study, we analyzed the fire during Auguest 8-9, 2023 that affected Lahaina in Maui.

![Big Earth Hackathon Poster](./public/Final Big Earth Hackathon Poster.png)

## Project Details

Our dataset is derived from a large volume of Twitter data. We processed these tweets, focusing on those containing specific keywords related to wildfires. The data includes the geotagged username, time of the post, text content, url, and crucially, geolocation information. The geotagging was performed using the **Skalen AI's** geotagging model in partnership with its creator, Alina Pak.

- **Fire Duration**: August 8-9
- **Study Timeframe**: August 1-13, 2023 (for pre-fire + post-fire study)
- **Social Media**: Twitter
- **Twitter Keywords**: wildfire, maui, fire, power, lost, missing

Beyond data geolocated from Twitter, we also utilized satellite data to compare the timestamps of the Tweets with the fire as it actively occurred specifically within Maui.

- **Images**: Query PlanetScope scenes of the four affected areas, including Lahaina, Kula, East of Kihei, and East of Pukulani, from Planet.com. Due to variations in satellite image quality depending on daily weather conditions, we select one day before the fire and one day after the fire with the best quality as representations.
- **Assessment**: We employ the **Difference Vegetation Index (DVDI)** method to evaluate satellite images captured before and after the fire. This analysis allows us to assess vegetation health and detect changes in the landscape caused by the fire, aiding in understanding the extent of the fire's impact on the environment.

## Tools and Methods

### Follower-based Analysis

- **Tool**: d3.js for dynamic visualization of followers, on Next.js for front end client processing
- **Methods**: Utilized Bron-Kerbosch to find k-cliques, which are k-sized subgroups of a graph where all nodes are interconnected. Number of users considered, follower threshold for adding edge, and size of cliques (k) during visualization modifiable on web frontend.
- **Dataset**: geotagging Twitter dataset
- **Purpose**: This way, can feasibly find common linkages between users based on followers, and in some cases, expect to find the locations of users that are not geotagged

### Timescale Analysis

- **Tool**: Foluim, a python library helps create several types of Leaflet map
- **Features**: twitter posts, fire starting location, fire-affected area, time slider
- **Dataset**: collected data of fire events online, including area name, location, time, news contents, url (See table 2 and table 3), fire-affected area layer
