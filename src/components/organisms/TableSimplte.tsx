import Paper from 'components/atoms/Paper'
import Table from 'components/atoms/Table'
import TableBody from 'components/atoms/TableBody'
import TableCell from 'components/atoms/TableCell'
import TableContainer from 'components/atoms/TableContainer'
import TableHead from 'components/atoms/TableHead'
import TableRow from 'components/atoms/TableRow'
import React from 'react'

function TableSimplte<T>({
    columns,
    items,
    render,
}: {
    columns: Array<React.ReactChild>,
    items: Array<T>,
    render: (item: T) => React.ReactElement
}) {
    return (<TableContainer component={Paper} >
        <Table>
            <TableHead>
                <TableRow>
                    {
                        columns.map((item, index) => (
                            <TableCell key={index} >{item}</TableCell>
                        ))
                    }
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    items.map(item => render(item))
                }
            </TableBody>
        </Table>
    </TableContainer>)
}

export default TableSimplte