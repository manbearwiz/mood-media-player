# mood-media-player

Javascript/Typescript library for controlling a Mood Media player through the REST api

## Setup

Install with npm

```Shell
npm i --save mood-media-player
```

Import module and login using default credentials

```TypeScript
import { MoodPlayer } from "mood-media-player";

const moodPlayer = new MoodPlayer(Environment.moodUri);

moodPlayer.login()
```

## Examples

### Get Current Station

The API makes heavy use of RxJS Observables so you must subscribe to any async api calls like so

```TypeScript
moodPlayer.login().subscribe(() => {
    moodPlayer.getCurrentStation()
        .subscribe(console.log);
});
```

### Set Volume

Under the hood, we use `Observable.bindCallback` so the underlying AJAX request is only sent if you subscribe to the observable. Because of this, you must subscribe to simple commands, even if you do not care about the response.

```TypeScript
moodPlayer.login().subscribe(() => {
    moodPlayer.setVolume(75)
        .subscribe(console.log);

    moodPlayer.skipTrack()
        .subscribe(console.log);
});
```

### Search and Create Stations

Query the preset genre stations in Pandora and create a personal station from the first result

```TypeScript
moodPlayer.login()
    .mergeMap(() => moodPlayer.searchGenreStations("50s rock"))
    .first()
    .do(station => console.log(station.name))
    .map(station => station.id)
    .mergeMap(moodPlayer.createStation)
    .subscribe(console.log);
```

### Give Positive Feedback for Last 5 Songs

```TypeScript
moodPlayer.login()
    .mergeMap(moodPlayer.getStationHistory)
    .take(5)
    .do(song => console.log(song.title))
    .map(song => song.id)
    .mergeMap(moodPlayer.givePositiveTrackFeedback)
    .subscribe(console.log);
```

### Poll

Since the Mood devices don't support web sockets you must poll to receive updates. This example polls every 1 second and logs the song every time it changes.

```TypeScript
moodPlayer.login().subscribe(() => {
    moodPlayer.poll().song$
        .subscribe(console.log);
});
```
