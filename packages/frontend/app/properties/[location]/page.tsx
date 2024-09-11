import OrderedPropertiesCalculator from "../../../../backend/src/services/firstparty/zillow";
import GeocodeClient from "../../../../backend/src/data/firstparty/googlemaps/client";
import {getSearchPageResponse} from "../../../../backend/src/data/thirdparty/zillow/client";
import {DataColumn, UserSpecifiedColumn} from "@/components/Table/Row";
import Table from "@/components/Table";

const apiKey = process?.env?.GOOGLE_MAPS_API_KEY;
if (!apiKey) {
    throw new Error("Missing apiKey");
}

const calculator = new OrderedPropertiesCalculator(
    new GeocodeClient(apiKey),
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
                apiKey={apiKey}
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
