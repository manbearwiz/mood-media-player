import { ZoneStatus, MoodResponse, Song, GenreStationsData, LoginData, RequestBody, ZoneData, StationsData, ZonesData, SongsData, Station, StationCategory } from "./request_interfaces";
import { MoodPlayer } from "./mood_player"

import { Observable, ReplaySubject, Subscription } from "rxjs";

export class MoodPlayerPoller {
    
        private readonly _status$: ReplaySubject<ZoneStatus>;
        private readonly _volume$: ReplaySubject<number>;
        private readonly _song$: ReplaySubject<Song>;
        private readonly _station$: ReplaySubject<Station>;
    
        public readonly status$: Observable<ZoneStatus>;
        public readonly volume$: Observable<number>;
        public readonly song$: Observable<Song>;
        public readonly station$: Observable<Station>;
    
        private subscriptions: Array<Subscription> = [];
    
        constructor(private player: MoodPlayer, private interval = 1000) {
    
            this._status$ = new ReplaySubject(1);
            this._volume$ = new ReplaySubject(1);
            this._song$ = new ReplaySubject(1);
            this._station$ = new ReplaySubject(1);
    
            this.status$ = this._status$.asObservable();
            this.volume$ = this._volume$.asObservable();
            this.song$ = this._song$.asObservable();
            this.station$ = this._station$.asObservable();
    
            this.subscriptions.push(Observable
                .interval(interval)
                .switchMap(player.getStatus)
                .subscribe(this._status$));
    
            this.subscriptions.push(this._status$
                .filter(status => status && !!status.volume)
                .map(status => status.volume)
                .distinct()
                .subscribe(this._volume$));
    
            this.subscriptions.push(this._status$
                .filter(status => status && !!status.currentAudioSong)
                .map(status => status.currentAudioSong)
                .filter(song => song && !!song.id)
                .distinct(song => song.id)
                .subscribe(this._song$));
    
            this.subscriptions.push(this._status$
                .filter(status => status && !!status.currentAudioStyle)
                .map(status => status.currentAudioStyle)
                .filter(station => station && !!station.id)
                .distinct(station => station.id)
                .subscribe(this._station$));
        }
    
        destroy = () =>
            this.subscriptions
                .forEach((subscription: Subscription) => {
                    subscription.unsubscribe();
                });
    
    }
    