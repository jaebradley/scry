enum Column {
    Address,
    Price,
    Estimate,
    Difference,
}

type Data = {
    identifier: string;
    valuesByColumn: Map<Column, string>
}

const Row = (data: Data) => {
    return (
        <tr>
            {
                Array.from(data.valuesByColumn.entries())
                    .map(([key, value]) => (
                        <td key={`${data.identifier}-${key}`}>
                            {value}
                        </td>
                    ))
            }
        </tr>
    );
}

export default Row;
export {
    Column,
}
export type {
    Data
}