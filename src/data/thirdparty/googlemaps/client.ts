import {Client as GoogleMapsClient, GeocodeRequest, LatLngBounds} from "@googlemaps/google-maps-services-js";

interface ViewportCoordinatesAccessor {
    getViewportCoordinates(location: string): Promise<Array<LatLngBounds>>;
}

class Client implements ViewportCoordinatesAccessor {
    private readonly googleMapsClient: GoogleMapsClient;

    constructor(googleMapsClient: GoogleMapsClient) {
        this.googleMapsClient = googleMapsClient;
    }

    async getViewportCoordinates(location: string): Promise<Array<LatLngBounds>> {
        const result = await this.googleMapsClient.geocode(
            {
                params: {
                    address: location,
                    // TODO: @jaebradley make this into a provider
                    key: process.env.GOOGLE_MAPS_API_KEY || '',
                }
            }
        );
        return result.data.results.map(v => v.geometry.viewport);
    }
}

export default Client;
export type {
    ViewportCoordinatesAccessor
}
