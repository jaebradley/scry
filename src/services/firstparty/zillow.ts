import {ViewportCoordinatesAccessor} from "../../data/thirdparty/googlemaps/client";
import {SearchPageResponseAccessor, SearchPageResult} from "../../data/thirdparty/zillow/client";


class OrderedPropertiesCalculator {
    private readonly viewportAccessor: ViewportCoordinatesAccessor;
    private readonly searchPageAccessor: SearchPageResponseAccessor;

    constructor(viewportAccessor: ViewportCoordinatesAccessor, searchPageAccessor: SearchPageResponseAccessor) {
        this.viewportAccessor = viewportAccessor;
        this.searchPageAccessor = searchPageAccessor;
    }

    async getPropertiesOrderedByLargestDifferenceBetweenListingAndEstimatedPrice(location: string): Promise<Array<SearchPageResult>> {
        const boundaries = await this.viewportAccessor.getViewportCoordinates(location)
            .then(coordinates => coordinates.map(v => ({
                north: v.northeast.lat,
                east: v.northeast.lng,
                south: v.southwest.lat,
                west: v.southwest.lng
            })));
        // TODO: publish/read from a document store
        const result = await this.searchPageAccessor(boundaries[0], 1);
        let results = [result.cat1.searchResults.listResults];
        for (let page = 2; page < result.cat1.searchList.totalPages; page++) {
            const result = await this.searchPageAccessor(boundaries[0], page);
            results.push(result.cat1.searchResults.listResults);
        }
        const combinedResults = results.flatMap(v => v).filter((v => !!v.zestimate));
        return combinedResults.toSorted((first, second) => (second.zestimate - second.unformattedPrice) - (first.zestimate - first.unformattedPrice));
    }
}

export default OrderedPropertiesCalculator;