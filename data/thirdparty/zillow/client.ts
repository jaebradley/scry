type HomeInfo = {
    "zpid": number;
    "streetAddress": string;
    "zipcode": string;
    "city": string;
    "state": string;
    "latitude": number;
    "longitude": number;
    "price": number;
    "bathrooms": number;
    "bedrooms": number;
    "livingArea": number;
    "homeType": string;
    "homeStatus": string;
    "daysOnZillow": number;
    "isFeatured": boolean;
    "shouldHighlight": boolean;
    "zestimate": number;
    "rentZestimate": 4575;
    "isUnmappable": boolean;
    "isPreforeclosureAuction": boolean;
    "homeStatusForHDP": string;
    "priceForHDP": number;
    "timeOnZillow": number;
    "isNonOwnerOccupied": boolean;
    "isPremierBuilder": boolean;
    "isZillowOwned": boolean;
    "currency": string;
    "country": string;
    "taxAssessedValue": number;
    "lotAreaValue": number;
    "lotAreaUnit": string;
    "isShowcaseListing": boolean
}

type SearchPageResult = {
    zpid: string;
    id: string;
    imgSrc: string;
    detailUrl: string;
    statusType: string;
    statusText: string;
    countryCurrency: string;
    price: string;
    unformattedPrice: number;
    address: string;
    addressStreet: string;
    addressCity: string;
    addressState: string;
    addressZipcode: string;
    beds: number;
    baths: number;
    area: number;
    latLong: {
        latitude: number;
        longitude: number;
    },
    zestimate: number;
    hdpData: {
        homeInfo: HomeInfo;
    },
    info6String: string;
    brokerName: string;
    carouselPhotos: [
        {
            url: string;
        }
    ]
}

type SearchList = {
    pagination: {
        nextUrl: string;
    },
    totalResultCount: number;
    resultsPerPage: number;
    totalPages: number;
}

type SearchPageResponse = {
    cat1: {
        searchResults: {
            listResults: Array<SearchPageResult>
        },
        searchList: SearchList;
    }
}

type MapBoundary = {
    west: number;
    east: number;
    south: number;
    north: number;
};

interface SearchPageResponseAccessor {
    (area: MapBoundary, page: number): Promise<SearchPageResponse>;
}

// TODO: @jaebradley add filter state
const getSearchPageResponse: SearchPageResponseAccessor = async (area: MapBoundary, page: number): Promise<SearchPageResponse> => {

    const request = new Request(
        'https://www.zillow.com/async-create-search-page-state',
        {
            method: 'PUT',
            body: JSON.stringify({
                "searchQueryState": {
                    "pagination": {
                        currentPage: page
                    },
                    "mapBounds": area,
                    "filterState": {
                        "sortSelection": {"value": "globalrelevanceex"},
                        "price": {"min": 0, "max": 15000000},
                        "monthlyPayment": {"min": 0, "max": 72016},
                        "isAllHomes": {"value": true}
                    },
                },
                "wants": {"cat1": ["listResults"], "cat2": ["total"]},
            }),
            headers: {
                'Host': 'www.zillow.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Referer': 'https://www.zillow.com',
                'Content-Type': 'application/json',
                'Origin': 'https://www.zillow.com',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
            }
        }
    );

    const response = await fetch(request);

    if (response.ok) {
        return response.json() as Promise<SearchPageResponse>;
    }

    return Promise.reject(new Error(`invalid status: ${response?.status}`))
}

export { getSearchPageResponse };
export type {
    SearchPageResponse,
    SearchPageResponseAccessor,
    SearchList,
    SearchPageResult
};