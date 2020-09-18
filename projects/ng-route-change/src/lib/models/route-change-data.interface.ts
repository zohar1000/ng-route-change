export interface RouteChangeData {
  state: {
    url: string;
    urlAfterRedirects: string;
    // outlet: string;
    routeConfigPath: string;
    params: Object;
    queryParams: Object;
    data?: Object;
  };
  changes: {
    params: Object | null;
    queryParams: Object | null;
  };
}
