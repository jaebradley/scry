'use client';
import {Fragment, useEffect, useMemo, useState} from "react";
import Header from "@/components/Table/Header";
import Row, {Column, Data as RowData, DataColumn, UserSpecifiedColumn} from "@/components/Table/Row";
import Carousel from "@/components/Carousel";

type Pair<First, Second> = {
    first: First;
    second: Second;
}

type PropertyData = {
    identifier: string;
    valuesByColumn: Record<DataColumn, string | number>;
    detailUrl: string;
    carouselPhotoUrls: string[];
}

interface IComparator<T> {
    (first: T, second: T): number;
}

type TableProps = {
    // TODO: @jaebradley turn this into an immutable ordered Record/Map
    orderedColumns: Column[];
    namesByColumn: Map<Column, string>;
    propertyData: PropertyData[];
    apiKey: string;
}

enum SortDirection {
    Ascending,
    Descending,
}

const COMPARATORS_BY_COLUMN: Record<Column, IComparator<string> | IComparator<number>> = {
    [UserSpecifiedColumn.SelectedProperty]: (_: string, __: string) => 0,
    [DataColumn.Address]: (a: string, b: string) => a.localeCompare(b),
    [DataColumn.Price]: (a: number, b: number) => a - b,
    [DataColumn.Estimate]: (a: number, b: number) => a - b,
    [DataColumn.Difference]: (a: number, b: number) => a - b,
};

const FORMATTERS_BY_COLUMN: Record<Column, ((value: string) => string) | ((value: number) => string)> = {
    [UserSpecifiedColumn.SelectedProperty]: (v: string) => v,
    [DataColumn.Address]: (v: string) => v,
    [DataColumn.Price]: (v: number) => v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }),
    [DataColumn.Estimate]: (v: number) => v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }),
    [DataColumn.Difference]: (v: number) => v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }),
};

const Table = (props: TableProps) => {
    const [activelySortedColumn, setActivelySortedColumn] = useState<Pair<DataColumn, SortDirection> | undefined>(undefined);
    const [selectedPropertyAddress, setSelectedPropertyAddress] = useState<string | undefined>(undefined);
    const [selectedCarouselPhotoUrls, setSelectedCarouselPhotoUrls] = useState<string[]>([]);

    const handleColumnClick = (column: Column) => {
        if (column !== UserSpecifiedColumn.SelectedProperty) {
            if (activelySortedColumn) {
                if (column === activelySortedColumn.first) {
                    const nextSortDirection = activelySortedColumn.second === SortDirection.Descending ? SortDirection.Ascending : SortDirection.Descending;
                    setActivelySortedColumn({first: column, second: nextSortDirection});
                    setSelectedPropertyAddress(undefined);
                    return;
                }
            }

            setActivelySortedColumn({first: column, second: SortDirection.Descending});
            setSelectedPropertyAddress(undefined);
        }
    }

    const columnDataFormatter = (propertyData: PropertyData): Map<Column, string> => new Map(props.orderedColumns.map(column => ([column, FORMATTERS_BY_COLUMN[column](propertyData.valuesByColumn[column])])));
    const updatedPropertyData = useMemo(() => props.propertyData.map(v => ({ ...v, valuesByColumn: {...v.valuesByColumn, [UserSpecifiedColumn.SelectedProperty]: v.valuesByColumn[DataColumn.Address] === selectedPropertyAddress ? "📍" : ""}})), [selectedPropertyAddress, props]);
    const sortedData = activelySortedColumn ?
        updatedPropertyData.sort(
            (a: PropertyData, b: PropertyData) => (activelySortedColumn.second === SortDirection.Descending ? -1 : 1) * (
                COMPARATORS_BY_COLUMN[activelySortedColumn.first](
                    a.valuesByColumn[activelySortedColumn.first as DataColumn],
                    b.valuesByColumn[activelySortedColumn.first as DataColumn])
            )
        ) : updatedPropertyData;
    const rowData: RowData[] = sortedData
        .map(property => ({
            identifier: property.identifier,
            valuesByColumn: columnDataFormatter(property),
            onClick: (address, carouselPhotoUrls) => {
                setSelectedPropertyAddress(address);
                setSelectedCarouselPhotoUrls(carouselPhotoUrls);
            },
            detailUrl: property.detailUrl,
            carouselPhotoUrls: property.carouselPhotoUrls,
        }));

    useEffect(() => {
        if (!selectedPropertyAddress) {
            setSelectedPropertyAddress(rowData[0].valuesByColumn.get(DataColumn.Address));
            setSelectedCarouselPhotoUrls(rowData[0].carouselPhotoUrls);
        }
    }, [selectedPropertyAddress, setSelectedPropertyAddress, rowData]);

    const headerNamesByColumn = new Map<Column, string>([
        [UserSpecifiedColumn.SelectedProperty, ''],
        ...Array.from(props.namesByColumn.entries())
    ])

    return (
        <>
            {
                selectedPropertyAddress && (
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around' }}>
                        <iframe
                            width="600"
                            height="450"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=${props.apiKey}
    &q=${selectedPropertyAddress}>`}
                        />
                        <Carousel urls={selectedCarouselPhotoUrls} />
                    </div>
                )
            }
            <table className="border-collapse table-auto w-full text-sm">
                <Fragment>
                    <Header
                        namesByColumn={headerNamesByColumn}
                        onColumnClick={handleColumnClick}
                    />
                    <tbody>
                    {
                        rowData.map(v => (<Row key={v.identifier} {...v} />))
                    }
                    </tbody>
                </Fragment>
            </table>
        </>
    );
}

export default Table;