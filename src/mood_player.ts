import { ZoneStatus, MoodResponse, Song, GenreStationsData, LoginData, RequestBody, ZoneData, StationsData, ZonesData, SongsData, Station, StationCategory } from "./request_interfaces";

import { MoodPlayerPoller} from "./mood_player_poller";

import { Observable } from "rxjs";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/interval";

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

    public sendPost = (path: string, data: any): Observable<RequestBody<any>> =>
        this._post({
            url: `${this.uri}/${path}`,
            form: data,
            strictSSL: false,
            jar: this.cookieJar,
            json: true
        });

    public sendCommand = <T>(command: string, data = {}): Observable<T> =>
        this.sendPost(`cmd?cmd=${command}`, { ...data, zoneId: 1 })
            .map((response: RequestBody<T>): MoodResponse<T> => response.body)
            .map((x: MoodResponse<T>): T => x.data)

    public login = (): Observable<LoginData> =>
        this.sendPost("login", { user: this.user, password: this.password })
            .map((response: RequestBody<LoginData>): MoodResponse<LoginData> => response.body)
            .map((x: MoodResponse<LoginData>): LoginData => x.data)

    public getStatus = (): Observable<ZoneStatus> =>
        this.sendCommand<ZoneStatus>("zone.getStatus")

    public getVolume = (): Observable<number> =>
        this.getStatus()
            .map(status => status.volume);

    public getCurrentSong = (): Observable<Song> =>
        this.getStatus()
            .map(status => status.currentAudioSong);

    public getCurrentStation = (): Observable<Station> =>
        this.getStatus()
            .map(status => status.currentAudioStyle);

    public getGenreStations = (): Observable<StationCategory[]> =>
        this.sendCommand<GenreStationsData>("zone.station.getGenre")
            .map(data => data.categories)

    public getStations = (): Observable<Station[]> =>
        this.sendCommand<StationsData>("zone.station.audio.getAll")
            .map(data => data.styles)

    public getZones = (): Observable<ZonesData> =>
        this.sendCommand<ZonesData>("zone.getList")

    public setStation = (stationId: number): Observable<ZoneData> =>
        this.sendCommand<ZoneData>("zone.station.audio.set", { styleId: stationId })

    public setVolume = (volume: number): Observable<ZoneData> =>
        this.sendCommand<ZoneData>("zone.volume.set", { volume: volume })

    public skipTrack = (): Observable<ZoneData> =>
        this.sendCommand<ZoneData>("zone.track.skip", { step: 1 })

    public giveTrackFeedback = (positive: boolean, songId: string): Observable<ZoneData> =>
        this.sendCommand<ZoneData>("zone.track.feedback", { isPositive: positive, songId: songId })

    public resume = (): Observable<ZoneData> =>
        this.sendCommand<ZoneData>("zone.track.resume")

    public pause = (): Observable<ZoneData> =>
        this.sendCommand<ZoneData>("zone.track.pause")

    public getStationHistory = (): Observable<Song[]> =>
        this.sendCommand<SongsData>("zone.station.getHistory")
            .map(data => data.songs)

    public poll = (interval = 1000) =>
        new MoodPlayerPoller(this, interval);
}
