# mood-media-player
Javascript/Typescript library for controlling a Mood Media player through the REST api

## Setup

Install with npm

```
npm i --save mood-media-player
```

Import module and login using default credentials

```
import { MoodPlayer } from "mood-media-player";

const moodPlayer = new MoodPlayer(Environment.moodUri);

moodPlayer.login()
```

## Examples

### Get Current Station

The API makes heavy use of RxJS Observables so you must subscribe to any async api calls like so

```
moodPlayer.login().subscribe(() => {
    moodPlayer.getCurrentStation()
        .subscribe(console.log);
});
```

### Set Volume

No subscriptions are needed for simple actions

```
moodPlayer.login().subscribe(() => {
    moodPlayer.setVolume(75);
    
    moodPlayer.skipTrack();
});
```

### Poll

Since the Mood devices don't support web sockets you must poll to receive updates. This example polls every 1 second and logs the song every time it changes.

```
moodPlayer.login().subscribe(() => {
    moodPlayer.poll(1000).song$
        .subscribe(console.log);
});
```
