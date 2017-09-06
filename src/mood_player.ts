import { ZoneStatus, MoodResponse, Song, GenreStationsData, LoginData, RequestBody, ZoneData, StationsData, ZonesData, SongsData, Station, StationCategory, StationSearchData } from "./request_interfaces";

import { MoodPlayerPoller } from "./mood_player_poller";

import { Observable } from "rxjs";

import * as request from "request";
import { RequestResponse } from "request";

export class MoodPlayer {

    constructor(private uri: string,
        private user = "admin",
        private password = "23646",
        private cookieJar = request.jar(),
        private _post = Observable.bindCallback(request.post, (a: RequestResponse, b: RequestBody<any>): RequestBody<any> => b)
    ) {
    }

    public sendPost = <T>(path: string, data: any): Observable<T> =>
        this._post({
            url: `${this.uri}/${path}`,
            form: data,
            strictSSL: false,
            jar: this.cookieJar,
            json: true
        }).map((response: RequestBody<T>): T => response.body.data)

    public sendCommand = <T>(command: string, data = {}): Observable<T> =>
        this.sendPost(`cmd?cmd=${command}`, { zoneId: 1, ...data })

    public login = (): Observable<LoginData> =>
        this.sendPost("login", { user: this.user, password: this.password })

    public getStatus = (): Observable<ZoneStatus> =>
        this.sendCommand("zone.getStatus")

    public getVolume = (): Observable<number> =>
        this.getStatus()
            .map(status => status.volume);

    public getCurrentSong = (): Observable<Song> =>
        this.getStatus()
            .map(status => status.currentAudioSong);

    public getCurrentStation = (): Observable<Station> =>
        this.getStatus()
            .map(status => status.currentAudioStyle);

    public getGenreStations = (): Observable<StationCategory> =>
        this.sendCommand<GenreStationsData>("zone.station.getGenre")
            .mergeMap(data => Observable.of(...data.categories))
            
    public searchStations = (query: string): Observable<StationSearchData> =>
        this.sendCommand("zone.station.search", { query: query })

    public searchGenreStations = (query: string): Observable<Station> =>
        this.searchStations(query)
            .mergeMap(searchResults => Observable.of(...searchResults.genreStyles))

    public getStations = (): Observable<Station> =>
        this.sendCommand<StationsData>("zone.station.audio.getAll")
            .mergeMap(data => Observable.of(...data.styles))
            
    public createStation = (stationToken: string): Observable<ZoneData> =>
        this.sendCommand("zone.station.create", { tokenType: "STATION", token: stationToken })

    public getZones = (): Observable<ZonesData> =>
        this.sendCommand("zone.getList")

    public setStation = (stationId: number): Observable<ZoneData> =>
        this.sendCommand("zone.station.audio.set", { styleId: stationId })

    public setVolume = (volume: number): Observable<ZoneData> =>
        this.sendCommand("zone.volume.set", { volume: volume })

    public skipTrack = (): Observable<ZoneData> =>
        this.sendCommand("zone.track.skip", { step: 1 })

    public giveTrackFeedback = (positive: boolean, songId: string): Observable<ZoneData> =>
        this.sendCommand("zone.track.feedback", { isPositive: positive, songId: songId })

    public givePositiveTrackFeedback = (songId: string): Observable<ZoneData> =>
        this.giveTrackFeedback(true, songId)

    public giveNegativeTrackFeedback = (songId: string): Observable<ZoneData> =>
        this.giveTrackFeedback(false, songId)

    public resume = (): Observable<ZoneData> =>
        this.sendCommand("zone.track.resume")

    public pause = (): Observable<ZoneData> =>
        this.sendCommand("zone.track.pause")

    public getStationHistory = (): Observable<Song> =>
        this.sendCommand<SongsData>("zone.station.getHistory")
            .mergeMap(data => Observable.of(...data.songs))

    public poll = (interval = 1000) =>
        new MoodPlayerPoller(this, interval);
}
