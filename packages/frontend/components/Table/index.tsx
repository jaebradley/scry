'use client';

import {Fragment, useState} from "react";
import Header from "@/components/Table/Header";
import Row, {Column, Data as RowData} from "@/components/Table/Row";

type Pair<First, Second> = {
    first: any;
    second: any;
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
    comparatorsByColumn: Record<Column, IComparator<string | number>>;
    formattersByColumn: Record<Column, (value: string | number) => string>;
}

enum SortDirection {
    Ascending,
    Descending,
}

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

    const propertyDataFormatter = (propertyData: PropertyData): Map<Column, string> => new Map(data.orderedColumns.map(column => ([column, data.formattersByColumn[column](propertyData.valuesByColumn[column])])));
    const sortedData = activelySortedColumn ?
        data.propertyData.sort(
            (a, b) => (activelySortedColumn.second === SortDirection.Descending ? -1 : 1) * (
                data.comparatorsByColumn[activelySortedColumn.first as Column](
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
        <table>
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