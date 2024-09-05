'use client';

import OrderedPropertiesCalculator from "../../backend/src/services/firstparty/zillow";
import GeocodeClient from "../../backend/src/data/firstparty/googlemaps/client";
import {getSearchPageResponse} from "../../backend/src/data/thirdparty/zillow/client";
import Header from "@/components/Table/Header";
import Row, {Column} from "@/components/Table/Row";
import {Fragment} from "react";

export default async function Home() {
    const apiKey = process?.env?.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error("Missing apiKey");
    }

    const calculator = new OrderedPropertiesCalculator(
        new GeocodeClient(apiKey),
        getSearchPageResponse
    );
    // TODO: @jaebradley use real data in future
    // const results = await calculator.getPropertiesOrderedByLargestDifferenceBetweenListingAndEstimatedPrice('Cambridge, MA');
    const results = [
        {
            identifier: "jae",
            valuesByColumn: new Map([
                [Column.Address, "foo"],
                [Column.Price, "$123,456"],
                [Column.Estimate, "$100,000"]]),
        },
        {
            identifier: "baebae",
            valuesByColumn: new Map([
                [Column.Address, "bar"],
                [Column.Price, "$456,789"],
                [Column.Estimate, "$500,000"]])
        }
    ];


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <table>
                <Fragment>
                    <Header
                        namesByColumn={
                            new Map([
                                [Column.Address, "Address"],
                                [Column.Price, "Price"],
                                [Column.Estimate, "Zillow Estimate"],
                            ])
                        }
                        onColumnClick={(c) => console.log(c)}
                    />
                    {
                        results.map(result => (
                            <Row {...result} />
                        ))
                    }
                </Fragment>
            </table>
        </main>
    );
}
