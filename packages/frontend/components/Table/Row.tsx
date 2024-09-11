import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons'

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
    valuesByColumn: Map<Column, string>;
    onClick: (address: string | undefined) => void;
    detailUrl: string;
}

const Row = (props: Data) => {
    return (
        <tr key={`${props.identifier}`} onClick={(_) => props.onClick(props.valuesByColumn.get(DataColumn.Address))}>
            {
                Array.from(props.valuesByColumn.entries())
                    .map(([key, value]) => (
                        <td key={`${props.identifier}-${key}`}>
                            {
                                key === DataColumn.Address ?
                                    <span>{value} <a href={props.detailUrl} target="_blank"><FontAwesomeIcon icon={faExternalLink}/></a></span>:
                                    value
                            }
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