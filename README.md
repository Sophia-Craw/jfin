# Jellyfin Music Client (To be named)

## Deployment
Currently there is no prebuilt binaries or anything so you'll have to just run it in a dev environment. To do so do the following:

1. Create `.env` file at the root of the `/src` folder.

2. Insert your appropriate Jellyfin server info and API key in as follows:
   
   ```
    JELLYFIN_ADDRESS="<https://jellyfin.myinstance.com>"
    API_KEY="<Jellyfin API Key>"
   ```

   To create an API key head to the web interface of your Jellyfin instance and then proceed to your dashboard. There you will find a menu on the left hand side. Scroll to the bottom and you will see a section called "API Keys". Click on that option and click the "+ New API key" button.

   Once you've done this open the root of the repository in a terminal and run the follwing.

   ```npm i```

   Wait for this to finish.

   ```npm run dev```

### This will be improved overtime. The goal is that you can just log into the server and as a user on the server to access the backend.

![TODO](/TODO.MD)

![Albums](/preview/albums.png)
![Album](/preview//album.png)

![Artists](/preview/artists.png)

![Tracks](/preview/tracks.png)