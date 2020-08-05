export interface RouteChangeData {
  state: {
    url: string;
    urlAfterRedirects: string;
    // outlet: string;
    routeConfigPath: string;
    params: Object;
    queryParams: Object;
  };
  changes: {
    params: Object | null;
    queryParams: Object | null;
  };
}
