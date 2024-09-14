export const runtime = 'edge';

import OrderedPropertiesCalculator from "@/services/firstparty/zillow";
import GeocodeClient from "@/data/firstparty/googlemaps/client";
import {getSearchPageResponse} from "@/data/thirdparty/zillow/client";
import {DataColumn} from "@/components/Table/Row";
import Table from "@/components/Table";

const GOOGLE_MAPS_GEOCODING_API_KEY = process?.env?.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_GEOCODING_API_KEY) {
    throw new Error("Missing Google Maps Geocoding API Key");
}

const calculator = new OrderedPropertiesCalculator(
    new GeocodeClient(GOOGLE_MAPS_GEOCODING_API_KEY),
    getSearchPageResponse
);

export default async function Page({params}: { params: { location: string } }) {
    const results = await calculator.getPropertiesOrderedByLargestDifferenceBetweenListingAndEstimatedPrice(params.location);

    const propertyData = results
        .map(v => ({
            identifier: v.id,
            valuesByColumn: {
                [DataColumn.Address]: v.address,
                [DataColumn.Price]: v.unformattedPrice,
                [DataColumn.Estimate]: v.zestimate,
                [DataColumn.Difference]: v.zestimate - v.unformattedPrice
            },
            detailUrl: v.detailUrl,
            carouselPhotoUrls: (v.carouselPhotos || []).map(v => v.url),
        }))

    return (
        <main>
            <Table
                orderedColumns={[DataColumn.Address, DataColumn.Price, DataColumn.Estimate, DataColumn.Difference]}
                namesByColumn={
                    new Map([
                        [DataColumn.Address, "Address"],
                        [DataColumn.Price, "Listing Price"],
                        [DataColumn.Estimate, "Zillow Estimate"],
                        [DataColumn.Difference, "Difference"],
                    ])
                }
                propertyData={propertyData}
            />
        </main>
    );
}
