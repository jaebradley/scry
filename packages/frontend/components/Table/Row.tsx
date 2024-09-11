enum DataColumn {
    Address = "Address",
    Price = "Price",
    Estimate = "Estimate",
    Difference = "Difference",
}

enum UserSpecifiedColumn {
    SelectedProperty = "SelectedProperty",
}

type Column = DataColumn | UserSpecifiedColumn;

type Data = {
    identifier: string;
    valuesByColumn: Map<Column, string>
    onClick: (address: string | undefined) => void
}

const Row = (props: Data) => {
    return (
        <tr key={`${props.identifier}`} onClick={(_) => props.onClick(props.valuesByColumn.get(DataColumn.Address))}>
            {
                Array.from(props.valuesByColumn.entries())
                    .map(([key, value]) => (
                        <td key={`${props.identifier}-${key}`}>
                            {value}
                        </td>
                    ))
            }
        </tr>
    );
}

export default Row;
export {
    DataColumn,
    UserSpecifiedColumn
}
export type {
    Data,
    Column,
}