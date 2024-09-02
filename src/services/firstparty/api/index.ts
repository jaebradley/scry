import {Hono} from 'hono'
import {basicAuth} from 'hono/basic-auth';

import OrderedPropertiesCalculator from "../zillow";
import GeocodeClient from "../../../data/thirdparty/googlemaps/client";
import {Client as GoogleMapsClient} from "@googlemaps/google-maps-services-js/dist/client";
import {getSearchPageResponse} from "../../../data/thirdparty/zillow/client";

const app = new Hono();
const authenticationMiddleware = basicAuth({
    username: 'admin',
    password: 'secret',
});
const propertiesCalculator = new OrderedPropertiesCalculator(
    new GeocodeClient(
        new GoogleMapsClient(),
    ),
    getSearchPageResponse
);

app.use('/*', authenticationMiddleware);;

app.get('/', (c) => c.text('Hono!'));
app.get('/properties', (c) => {
    return c.json(propertiesCalculator.getPropertiesOrderedByLargestDifferenceBetweenListingAndEstimatedPrice("Cambridge, MA"))
})

export default app