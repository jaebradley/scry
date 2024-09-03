import OrderedPropertiesCalculator from "../../../src/services/firstparty/zillow";
import GeocodeClient from "../../../src/data/firstparty/googlemaps/client";
import {describe, expect, test} from "vitest";
import {getSearchPageResponse} from "../../../src/data/thirdparty/zillow/client";

describe('OrderedPropertiesCalculator', () => {
    describe('Get properties by largest difference between listing and estimated prices', () => {
        test('Results exist for Cambridge, MA', async () => {
            const apiKey = process?.env?.GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                throw new Error("Missing apiKey");
            }

            const calculator = new OrderedPropertiesCalculator(
                new GeocodeClient(apiKey),
                getSearchPageResponse
            );
            const results = await calculator.getPropertiesOrderedByLargestDifferenceBetweenListingAndEstimatedPrice('Cambridge, MA');
            expect(results).toBeTruthy();
            expect(results.length).greaterThan(0);
        });
    })
})