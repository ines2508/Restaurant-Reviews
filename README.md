# Restaurant Reviews

## Overview

Responsive website with extensions in code(**ARIA**) for screen readers, to help blind or disabled people to use and navigate through the site.

All dynamic data, such as maps, images, descriptions, reviews are fetch from **API**.

Site uses technology of **ServiseWorker** and collect , store visited pages to display them when user is offline.

### Beta version

The site is in beta version and in productive 
state. To use the site user needs to **download Python** to start backend server.

In most computers Python is already installed. To check if it's true and what kind of version is installed write in terminal:

    python -v


### Start the server

To start the server open the terminal and write:

    python3 -m http.server 8000

(for version Python 3.x)

or 

    python -m SimpleHTTPServer 8000

(for version Python 2.x)

### Display the website

After starting the server open browser and visit 
the site:

    http://localhost:8000

## Map

Website uses dynamic maps from **[Mapbox]** (https://www.mapbox.com/) which are implemented with open-source javascript library **[Leaflets]** https://leafletjs.com/
