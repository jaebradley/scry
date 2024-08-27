import OrderedPropertiesCalculator from "../../../src/services/firstparty/zillow";
import GeocodeClient from "../../../src/data/thirdparty/googlemaps/client";
import {Client as GoogleMapsClient} from "@googlemaps/google-maps-services-js";
import { describe, test, expect } from "vitest";
import {getSearchPageResponse} from "../../../src/data/thirdparty/zillow/client";
import { stringify } from "csv-stringify";
import { generate } from "csv-generate";
import * as fs from "node:fs";

describe('OrderedPropertiesCalculator', () => {
    describe('Get properties by largest difference between listing and estimated prices', () => {
        test('Results exist for Cambridge, MA', async () => {
           const calculator = new OrderedPropertiesCalculator(
               new GeocodeClient(
                   new GoogleMapsClient(),
               ),
               getSearchPageResponse
           );
           const results = await calculator.getPropertiesOrderedByLargestDifferenceBetweenListingAndEstimatedPrice('Cambridge, MA');
           expect(results).toBeTruthy();
           expect(results.length).greaterThan(0);

           // const file = fs.createWriteStream('./cambridge.csv')
           // generate()
           //     .pipe(stringify(results.map(v => ({ 'Zillow ID': v.id, 'Listing Price': v.unformattedPrice, 'Zestimate': v.zestimate, 'Address': v.address })), { header: true}))
           //     .pipe(file);
        });
    })
})