export interface Song {
    album: string;
    allowFeedback: boolean;
    artist: string;
    cover: string;
    feedback: string;
    id: string;
    sleep: boolean;
    title: string;
}

export interface Zone {
    id: number;
    name: string;
    type: string;
}

export interface Station {
    allowDelete: boolean;
    allowRename: boolean;
    allowSkip: boolean;
    hasAudio: boolean;
    id: string;
    name: string;
    shared: boolean;
    visible: boolean;
}

export interface PlayerError {
    code: string;
    message: string;
}

export interface PlayerMessage {
    title: string;
    type: string;
}

export interface ResponseStatus {
    code: string;
    operationId: number;
    timestamp: number;
}

export interface StationCategory {
    category: string;
    styles: Station[];
}

export interface GenreStationsData {
    categories: StationCategory[];
    zoneId: number;
}

export interface ZoneData {
    zoneId: number;
}

export interface ZonesData {
    zones: Zone[];
}

export interface StationsData {
    styles: Station[];
    zoneId: number;
}

export interface SongsData {
    songs: Song[];
    zoneId: number;
}

export interface StationSearchData {
    artists: Song[];
    genreStyles: Station[];
    songs: Song[];
    zoneId: number;
}

export interface ZoneStatus {
    allowSkipBackward: boolean;
    allowSkipForward: boolean;
    connected: boolean;
    currentAudioSong: Song;
    currentAudioStyle: Station;
    currentVisualSong: Song;
    currentVisualStyle?: any;
    disableSkip: boolean;
    error: PlayerError;
    message: PlayerMessage;
    muted: boolean;
    nextStyleTime: string;
    state: string;
    volume: number;
    zoneId: number;
}

export interface LoginData {
    message: string;
    url: string;
}

export interface MoodResponse<T> {
    data: T;
    status: ResponseStatus;
}

export interface RequestBody<T> {
    body: MoodResponse<T>;
}
