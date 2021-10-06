export interface LirikResult {
    status: number;
    result: {
        title: string;
        thumbnail: string;
        artist: string;
        lirik: string;
    }
}