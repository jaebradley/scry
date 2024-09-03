import {BlankInput, Handler, HandlerResponse} from "hono/types";
import OrderedPropertiesCalculator from "../zillow";
import GeocodeClient from "../../../data/firstparty/googlemaps/client";
import {getSearchPageResponse, SearchPageResult} from "../../../data/thirdparty/zillow/client";
import {IEnv} from "../../../configuration/firstparty/environment";


const handlePropertiesRequest: Handler<IEnv, "/properties", BlankInput, HandlerResponse<any>> = async (context) => {
    const locationValue = context.req.query("location");
    if (locationValue) {
        let propertyResults: Array<SearchPageResult>;
        try {
            const propertiesCalculator = new OrderedPropertiesCalculator(
                // @ts-ignore
                new GeocodeClient(context?.env?.GOOGLE_MAPS_API_KEY),
                getSearchPageResponse
            );
            propertyResults = await propertiesCalculator.getPropertiesOrderedByLargestDifferenceBetweenListingAndEstimatedPrice(locationValue);
        } catch (Exception) {
            return context.newResponse(null, 400);
        }
        return context.json(propertyResults);
    }
    return context.newResponse(null, 400);
}

export {
    handlePropertiesRequest
};