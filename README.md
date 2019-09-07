# LAN Dashboard

LAN Dashboard is a streaming dashboard intended for events like LAN Parties.

### Installation

```bash
git clone https://github.com/wipeautcrafter/LANDashboard
cd LANDashboard
npm install
npm start
```

### Connecting

To connect to the RTMP Server, set the streaming server of your program of choice to `rtmp://<your local ip>/live`. For the stream key, provide the index of the player you want to connect to (0-3).

### Remote

To configure things like the title, description and amount of streams point your browser to `http://<your local ip>:3000`. 
