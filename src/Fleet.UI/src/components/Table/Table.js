import React from 'react'
import Loading from '../Loading/Loading'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

export class MyTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 0,
      rowsPerPage: this.props.rowsPerPage || 10,
      selected: [],
      orderBy: null,
      order: 'desc',
      confirmationDialog: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (event, item) {
    const { onSelect } = this.props
    if (onSelect) {
      onSelect(item)
    }
    const { selected } = this.state
    const selectedIndex = selected.indexOf(item)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = [...selected, item]
    } else { newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)] }
    this.setState({ selected: newSelected })
  }

  render () {
    if (!this.props.rows) {
      return <Loading />
    }
    const { classes } = this.props
    const { rows } = this.props

    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <TableContainer className={classes.container}>
            <Table stickyHeader className={classes.table} size='small'>
              <TableBody>
                {rows.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, row)}
                      role='checkbox'
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell style={{ fontSize: '18px' }}>{row.name}</TableCell>
                      <TableCell style={{ fontSize: '18px' }}>{row.value}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

        </div>

      </>
    )
  }
}

/*
TODO List

- standartize typeof phone number and date ( to sort correct)
- make table component get info from props

*/
