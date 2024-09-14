import {describe, expect, test} from "vitest";
import {getSearchPageResponse} from "@/data/thirdparty/zillow/client";

describe("Client", () => {
    describe("getSearchPageResponse", () => {
        test("first page", async () => {
            const response = await getSearchPageResponse(
                {
                    "east": -70.94810522363281,
                    "north": 42.52633280313823,
                    "south": 42.230109610399786,
                    "west": -71.27632177636718
                },
                1
            );
            expect(response).toBeTruthy();
        });
        test("second page", async () => {
            const response = await getSearchPageResponse(
                {
                    "east": -70.94810522363281,
                    "north": 42.52633280313823,
                    "south": 42.230109610399786,
                    "west": -71.27632177636718
                },
                2
            );
            expect(response).toBeTruthy();
        })
    });
});
