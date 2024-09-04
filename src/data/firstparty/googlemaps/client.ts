import LatLngLiteral = google.maps.LatLngLiteral;

type Viewport = {
    northeast: LatLngLiteral;
    southwest: LatLngLiteral;
}

type GeocodeResponse = {
    results: [
        {
            geometry: {
                viewport: Viewport;
            }
        }
    ];
}

interface ViewportCoordinatesAccessor {
    getViewportCoordinates(location: string): Promise<Array<Viewport>>;
}

/**
 * Custom client because axios is not supported on the edge: https://github.com/axios/axios/issues/5523
 */
class Client implements ViewportCoordinatesAccessor {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

// TODO: @jaebradley make the key a dependency of this client
    async getViewportCoordinates(location: string): Promise<Array<Viewport>> {
        const result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${this.apiKey}`, {
            method: "GET",
        });
        if (result.ok) {
            const responseData = await result.json<GeocodeResponse>();
            return responseData.results.map(v => v.geometry.viewport);
        }

        throw new Error("Could not fetch data");
    }
}

export default Client;
export type {
    ViewportCoordinatesAccessor
}
