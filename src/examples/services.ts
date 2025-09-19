export class ThemeService {
  color = '#448aff';
}
export class AnalyticsService {
  constructor(public key: string) {}
  track(ev:string, data:any){ /* no-op demo */ }
}
