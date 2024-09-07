'use client';
import {Fragment, useState} from "react";
import Header from "@/components/Table/Header";
import Row, {Column, Data as RowData} from "@/components/Table/Row";

type Pair<First, Second> = {
    first: First;
    second: Second;
}

type PropertyData = {
    identifier: string;
    valuesByColumn: Record<Column, string | number>
}

interface IComparator<T> {
    (first: T, second: T): number;
}

type Data = {
    // TODO: @jaebradley turn this into an immutable ordered Record/Map
    orderedColumns: Column[];
    namesByColumn: Map<Column, string>;
    propertyData: PropertyData[];
}

enum SortDirection {
    Ascending,
    Descending,
}

const COMPARATORS_BY_COLUMN: Record<Column, IComparator<string> | IComparator<number>> = {
    [Column.Address]: (a: string, b: string) => a.localeCompare(b),
    [Column.Price]: (a: number, b: number) => a - b,
    [Column.Estimate]: (a: number, b: number) => a - b,
    [Column.Difference]: (a: number, b: number) => a - b,
};

const FORMATTERS_BY_COLUMN: Record<Column, ((value: string) => string) | ((value: number) => string)> = {
    [Column.Address]: (v: string) => v,
    [Column.Price]: (v: number) => v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }),
    [Column.Estimate]: (v: number) => v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }),
    [Column.Difference]: (v: number) => v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }),
};

const Table = (data: Data) => {
    const [activelySortedColumn, setActivelySortedColumn] = useState<Pair<Column, SortDirection> | undefined>(undefined);
    const handleColumnClick = (column: Column) => {
        if (activelySortedColumn) {
            if (column === activelySortedColumn.first) {
                const nextSortDirection = activelySortedColumn.second === SortDirection.Descending ? SortDirection.Ascending : SortDirection.Descending;
                setActivelySortedColumn({first: column, second: nextSortDirection});
                return;
            }
        }

        setActivelySortedColumn({first: column, second: SortDirection.Descending});
    }

    const propertyDataFormatter = (propertyData: PropertyData): Map<Column, string> => new Map(data.orderedColumns.map(column => ([column, FORMATTERS_BY_COLUMN[column](propertyData.valuesByColumn[column])])));
    const sortedData = activelySortedColumn ?
        data.propertyData.sort(
            (a: PropertyData, b: PropertyData) => (activelySortedColumn.second === SortDirection.Descending ? -1 : 1) * (
                COMPARATORS_BY_COLUMN[activelySortedColumn.first](
                    a.valuesByColumn[activelySortedColumn.first as Column],
                    b.valuesByColumn[activelySortedColumn.first as Column])
            )
        ) : data.propertyData;
    const rowData: RowData[] = sortedData
        .map(property => ({
            identifier: property.identifier,
            valuesByColumn: propertyDataFormatter(property)
        }));

    return (
        <table className="border-collapse table-auto w-full text-sm">
            <Fragment>
                <Header
                    namesByColumn={data.namesByColumn}
                    onColumnClick={handleColumnClick}
                />
                <tbody>
                {
                    rowData.map(v => (<Row {...v} />))
                }
                </tbody>
            </Fragment>
        </table>
    );
}

export default Table;