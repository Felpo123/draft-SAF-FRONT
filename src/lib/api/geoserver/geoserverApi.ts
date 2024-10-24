import { AxiosHttpClient } from '../axiosHttpClient';
import { Geojson } from '@/lib/mapUtils';

class GeoserverApi {
  private client: AxiosHttpClient;
  private baseUrl: string = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.client = new AxiosHttpClient(baseUrl);
  }

  async getIncidentsByIDEvent(idEvent: string) {
    const filter = `<Filter><PropertyIsEqualTo><PropertyName>id_evento</PropertyName><Literal>${idEvent}</Literal></PropertyIsEqualTo></Filter>`;
    const encodedFilter = encodeURIComponent(filter);
    const wfsUrl = `/geoserver/desafio/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=desafio:incidentes&outputFormat=application/json&filter=${encodedFilter}`;
    return this.client.get<Geojson>(wfsUrl);
  }

  async authenticate(username: string, password: string) {
    return this.client.get('/geoserver/rest/workspaces', {
      headers: {
        Authorization: 'Basic ' + btoa(`${username}:${password}`),
        Accept: 'application/json',
      },
    });
  }

  async getUserRole(username: string, password: string) {
    return this.client.get(`/geoserver/rest/security/roles/user/${username}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + btoa(`${username}:${password}`),
      },
    });
  }
}

export const geoserverApi = new GeoserverApi('http://192.168.1.116:8080');
