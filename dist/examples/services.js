export class ThemeService {
    constructor() {
        this.color = '#448aff';
    }
}
export class AnalyticsService {
    constructor(key) {
        this.key = key;
    }
    track(ev, data) { }
}
