export declare class ThemeService {
    color: string;
}
export declare class AnalyticsService {
    key: string;
    constructor(key: string);
    track(ev: string, data: any): void;
}
