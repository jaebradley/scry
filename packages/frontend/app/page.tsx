'use client';

import OrderedPropertiesCalculator from "../../backend/src/services/firstparty/zillow";
import GeocodeClient from "../../backend/src/data/firstparty/googlemaps/client";
import {getSearchPageResponse} from "../../backend/src/data/thirdparty/zillow/client";
import {Column} from "@/components/Table/Row";
import Table from "@/components/Table";

export default function Home() {
    // const apiKey = process?.env?.GOOGLE_MAPS_API_KEY;
    // if (!apiKey) {
    //     throw new Error("Missing apiKey");
    // }
    //
    // const calculator = new OrderedPropertiesCalculator(
    //     new GeocodeClient(apiKey),
    //     getSearchPageResponse
    // );
    // TODO: @jaebradley use real data in future
    // const results = await calculator.getPropertiesOrderedByLargestDifferenceBetweenListingAndEstimatedPrice('Cambridge, MA');
    const results = [
        {
            identifier: "jae",
            valuesByColumn: {
                [Column.Address]: "foo",
                [Column.Price]: 123_456,
                [Column.Estimate]: 100_000,
                [Column.Difference]: 100,
            },
        },
        {
            identifier: "baebae",
            valuesByColumn: {
                [Column.Address]: "bar",
                [Column.Price]: 456_789,
                [Column.Estimate]: 500_000,
                [Column.Difference]: 1000,
            }
        }
    ];


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
                propertyData={results}
                comparatorsByColumn={{
                    [Column.Address]: (a: string, b: string) => a.localeCompare(b),
                    [Column.Price]: (a: number, b: number) => a - b,
                    [Column.Estimate]: (a: number, b: number) => a - b,
                    [Column.Difference]: (a: number, b: number) => a - b,
                }}
                formattersByColumn={{
                    [Column.Address]: (v: string) => v,
                    [Column.Price]: (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
                    [Column.Estimate]: (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
                    [Column.Difference]: (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
                }}
            />
        </main>
    );
}
