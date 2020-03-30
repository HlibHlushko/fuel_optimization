import React from 'react'
import { IconButton, Dialog, DialogTitle, DialogContentText, DialogContent, Button, DialogActions } from '@material-ui/core'
import Loading from '../Loading/Loading'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { ReactComponent as DeleteIcon } from './src/pics/deleteIcon.svg'

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
    // this.createData = this.createData.bind(this)
    this.desc = this.desc.bind(this)
    this.getSorting = this.getSorting.bind(this)
    this.stableSort = this.stableSort.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    this.handleRequestSort = this.handleRequestSort.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.openConfirmationDialog = this.openConfirmationDialog.bind(this)
  }

  /// sorting ///////////

  desc (a, b, orderBy) {
    return a[orderBy] === b[orderBy] ? 0 : (a[orderBy] < b[orderBy] ? 1 : -1)
  }

  stableSort (array, cmp) {
    const stablized = array.map((el, index) => [el, index])
    stablized.sort((a, b) => {
      const order = cmp(a[0], b[0])
      if (order) return order
      return a[1] - b[1]
    })
    return stablized.map(el => el[0])
  }

  getSorting (order, orderBy) {
    let mult = 1
    if (order === 'desc') mult = -1
    return (a, b) => mult * this.desc(a, b, orderBy)
  }

  /// //////////

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

  isSelected (item) {
    return this.state.selected.indexOf(item) !== -1
  }

  handleSelectAllClick (event) {
    let newSelected = []
    if (this.state.selected.length > 0) newSelected = []; else
    if (event.target.checked) {
      newSelected = this.props.rows
    } else newSelected = []

    this.setState({ selected: newSelected })
  }

  handleChangePage (event, newPage) {
    this.setState({ page: newPage })
  }

  handleChangeRowsPerPage (event) {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
    })
  }

  handleRequestSort (property) {
    const { order, orderBy } = this.state
    const isDesc = orderBy === property && order === 'desc'
    this.setState({ order: isDesc ? 'asc' : 'desc' })
    this.setState({ orderBy: property })
  }

  openConfirmationDialog (item) {
    this.setState({ confirmationDialog: true, deleted: item })
  }

  handleDelete (shouldDelete) {
    if (shouldDelete) {
      this.props.onDeleteRequested(this.state.deleted)
    }
    this.setState({ deleted: null, confirmationDialog: false })
  }

  render () {
    console.log(this.props.rows)
    if (!this.props.rows) {
      return <Loading />
    }
    const { classes } = this.props
    const { isSelection, isDeletion } = this.props
    // isSelection = true
    // isDeletion = true
    const { headRows, rows } = this.props
    const { page, rowsPerPage, selected } = this.state
    const { order, orderBy } = this.state
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)
    const numSelected = selected.length
    const rowCount = rows.length
    // const { dense } = this.state
    // console.log(rows)
    const selectionHeader = isSelection ? (
      <TableCell padding='checkbox'>
        {
          (isSelection ? (
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={this.handleSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
              color='primary'
            />) : null)
        }
      </TableCell>
    ) : null
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <TableContainer className={classes.container}>
            <Table stickyHeader className={classes.table} size='small'>
              <TableHead>
                <TableRow className={classes.tableHeader}>
                  {selectionHeader}
                  {headRows.map(row => (
                    <TableCell
                      className={classes.tableHeaderCell}
                      key={row.id}
                      size='small'
                      style={{ minWidth: row.minWidth || 0, maxWidth: row.maxWidth || 200, backgroundColor: 'white' }}
                      align={row.numericHead ? 'center' : 'left'}
                      padding={row.disablePadding ? 'none' : 'default'}
                      sortDirection={orderBy === row.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={() => this.handleRequestSort(row.id)}
                      >
                        {row.label}
                        {/* {orderBy === row.id ? (
                          <span className={classes.visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </span>
                        ) : null} */}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  {isDeletion ? <TableCell style={{ backgroundColor: 'white' }} /> : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.stableSort(rows, this.getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = this.isSelected(row)
                    const labelId = `enhanced-table-checkbox-${index}`
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, row)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        {isSelection
                          ? (
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                                color='primary'
                              />
                            </TableCell>)
                          : null}
                        {headRows.map((item, id) => (
                          <TableCell
                            key={`table-cell-${id}`}
                            style={{ minWidth: row.minWidth || 0, maxWidth: row.maxWidth || 200 }}
                            align={item.numeric ? 'center' : 'left'}
                            className={classes.tableCell}
                          >{row[item.id]}
                          </TableCell>
                        ))}
                        {isDeletion
                          ? (
                            <TableCell padding='none'>
                              <IconButton
                                aria-label='delete' onClick={(event) => {
                                  event.stopPropagation()
                                  this.openConfirmationDialog(row)
                                }}
                              >
                                <DeleteIcon fill='#52575A' />
                              </IconButton>
                            </TableCell>
                          )
                          : null}
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className={classes.tablePagination}
            rowsPerPageOptions={[10, 25, 50]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'previous page'
            }}
            nextIconButtonProps={{
              'aria-label': 'next page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </div>
        <Dialog
          open={this.state.confirmationDialog}
        >
          <DialogTitle>Delete?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to remove? This action cannot be undone
            </DialogContentText>
            <DialogActions>
              <Button onClick={() => this.handleDelete(true)}>Yes</Button>
              <Button onClick={() => this.handleDelete(false)}>Cancel</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </>
    )
  }
}

/*
TODO List

- standartize typeof phone number and date ( to sort correct)
- make table component get info from props

*/
