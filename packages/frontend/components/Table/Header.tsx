'use client';

import {Column} from "@/components/Table/Row";

type Data = {
    namesByColumn: Map<Column, string>;
    onColumnClick: (column: Column) => void;
}

const Header = (data: Data) => {
    return (
        <tr>
            {
                Array.from(data.namesByColumn.entries())
                    .map(([key, value]) => (
                        <th key={key} onClick={() => data.onColumnClick(key)}>
                            {value}
                        </th>
                    ))
            }
        </tr>
    );
}

export default Header;