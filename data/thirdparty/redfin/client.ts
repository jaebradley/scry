type PropertyDataResponse = {
    version: number;
    errorMessage: string;
    resultCode: number;
    payload: {
        homes: [
            {
                mlsId: {
                    label: string;
                    value: string;
                },
                mlsStatus: string;
                price: {
                    value: number;
                    level: number;
                },
                hoa: {
                    level: number;
                },
                sqFt: {
                    value: number;
                    level: number;
                },
                lotSize: {
                    value: number;
                    level: number;
                },
                beds: number;
                baths: number;
                fullPaths: number;
                partialBaths: number;
                pricePerSqFt: {
                    value: number;
                    level: number;
                },
                location: {
                    value: string;
                    level: number;
                },
                stories: number;
                latLong: {
                    value: {
                        latitude: number;
                        longitude: number;
                    },
                    level: number,
                },
                streetLine: {
                    value: string;
                    level: number,
                },
                unitNumber: {
                    level: number;
                },
                city: string;
                state: string;
                postalCode: {
                    value: string;
                    level: number;
                },
                countryCode: string;
                soldDate: number;
                searchStatus: number;
                propertyType: number;
                uiPropertyType: number;
                listingType: number;
                propertyId: number;
                listingId: number;
                dataSourceId: number;
                marketId: number;
                yearBuilt: {
                    value: number;
                    level: number;
                },
                timeOnRedfin: {
                    value: number;
                    level: number;
                },
                originalTimeOnRedfin: {
                    value: number;
                    level: number;
                },
                url: string;
                isHot: boolean;
                listingRemarks: string;
                isNewConstruction: boolean;
            }
        ]
    }
}

interface IPropertyDataAccessor {
    (): Promise<PropertyDataResponse>;
}

const getPropertyData: IPropertyDataAccessor = async (): Promise<PropertyDataResponse> => {
    throw new Error("not yet implemented");
}