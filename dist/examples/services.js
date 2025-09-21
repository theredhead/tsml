"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = exports.ThemeService = void 0;
class ThemeService {
    constructor() {
        this.color = '#448aff';
    }
}
exports.ThemeService = ThemeService;
class AnalyticsService {
    constructor(key) {
        this.key = key;
    }
    track(ev, data) { }
}
exports.AnalyticsService = AnalyticsService;
