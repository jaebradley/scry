import OrderedPropertiesCalculator from "../../backend/src/services/firstparty/zillow";
import GeocodeClient from "../../backend/src/data/firstparty/googlemaps/client";
import {getSearchPageResponse} from "../../backend/src/data/thirdparty/zillow/client";
import {Column} from "@/components/Table/Row";
import Table from "@/components/Table";

const apiKey = process?.env?.GOOGLE_MAPS_API_KEY;
if (!apiKey) {
    throw new Error("Missing apiKey");
}

const calculator = new OrderedPropertiesCalculator(
    new GeocodeClient(apiKey),
    getSearchPageResponse
);

export default async function Home() {

    const results = await calculator.getPropertiesOrderedByLargestDifferenceBetweenListingAndEstimatedPrice('Cambridge, MA');

    const propertyData = results
        .map(v => ({
            identifier: v.id,
            valuesByColumn: {
                [Column.Address]: v.address,
                [Column.Price]: v.unformattedPrice,
                [Column.Estimate]: v.zestimate,
                [Column.Difference]: v.zestimate - v.unformattedPrice
            }
        }))

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Table
                orderedColumns={[Column.Address, Column.Price, Column.Estimate, Column.Difference]}
                namesByColumn={
                    new Map([
                        [Column.Address, "Address"],
                        [Column.Price, "Listing Price"],
                        [Column.Estimate, "Zillow Estimate"],
                        [Column.Difference, "Difference"],
                    ])
                }
                propertyData={propertyData}
            />
        </main>
    );
}
