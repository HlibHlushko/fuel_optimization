import React from 'react'

import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer'
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from '@david.kucsai/react-pdf-table'
import { getAddressText } from '../../services/hereClient'

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  numericText: {

    textAlign: 'center',
    fontSize: '14',
    fontFamily: 'Roboto'
    // marginRight: '25px'
  },
  text: {

    textAlign: 'left',
    fontSize: '14',
    fontFamily: 'Roboto'
    // marginRight: '25px'
  },
  tableCell: {
    textAlign: 'left',
    fontSize: '14',
    fontFamily: 'Roboto',
    minWidth: '150px'
  },
  totalChild: {
    fontSize: '14',
    fontFamily: 'Roboto'
  },

  total: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: '15px',
    marginRight: '25px',
    fontFamily: 'Roboto'
  },
  document: {
    // margin: '10px 10px 10px 10px'
    padding: '15px'
  }
})
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
})

export class Pdf extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      truck: null,
      driver: null
    }
  }

  render () {
    const { data, truck, driver, info } = this.props
    return (
      <File
        data={data}
        truck={truck}
        driver={driver}
        info={info}
      />
    )
  }
}

export const File = props => {
  const { truck, driver, data, info } = props
  // console.log('ee', data)
  const { optimizedPoints, fuel } = data
  const { totalCost, totalFuel } = calcVolumeAndCost(optimizedPoints)
  return (
    <Document>
      <Page
        size={[200 + optimizedPoints.length * 30, 700]}
        orientation='landscape'
        style={styles.document}
      >
        <View>
          <Text style={styles.text}>Truck: {truck ? `${truck.tractorModel} (${truck.tractorStateNumberOrVin})` : 'N\\A'}</Text>
          {truck && truck.trailerModel && <Text>Trailer: {truck.trailerModel} ({truck.trailerStateNumberOrVin}) </Text>}
          <Text style={styles.text}>Driver: {(driver && driver.fullName) || 'N\\A'} </Text>
          <Table
            data={renderData(optimizedPoints, fuel)}
          >
            <TableHeader>
              <TableCell style={styles.tableCell}>
                Route
              </TableCell>
              <TableCell style={styles.numericText}>
                Load
              </TableCell>
              <TableCell style={styles.numericText}>
                Unload
              </TableCell>
              <TableCell style={styles.numericText}>
                Remaining Fuel
              </TableCell>
              <TableCell style={styles.numericText}>
                Bought Fuel
              </TableCell>
              <TableCell style={styles.numericText}>
                FuelCost, €
              </TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell style={styles.tableCell} getContent={(r) => r.route} />
              <DataTableCell style={styles.numericText} getContent={(r) => r.load} />
              <DataTableCell style={styles.numericText} getContent={(r) => r.unload} />
              <DataTableCell style={styles.numericText} getContent={(r) => r.residualFuel && Number.parseFloat(r.residualFuel).toFixed(2)} />
              <DataTableCell style={styles.numericText} getContent={(r) => r.boughtFuel && Number.parseFloat(r.boughtFuel).toFixed(2)} />
              <DataTableCell style={styles.numericText} getContent={r => r.fuelCost} />
            </TableBody>
          </Table>
          <View style={styles.total}>
            <Text style={styles.totalChild}>
              Total bought fuel: {totalFuel.toFixed(2)} liters
            </Text>
            <Text style={styles.totalChild}>
              Total fuel cost: {totalCost.toFixed(2)} €
            </Text>
            <Text style={styles.totalChild}>
              Total distance: {(info.distance / 1000.0).toFixed(3)} km
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
const calcVolumeAndCost = (points) => {
  let totalFuel = 0
  let totalCost = 0
  points = points.filter(p => p.type === 2)

  for (let i = 0; i < points.length; ++i) {
    totalFuel += points[i].refuel
    totalCost += points[i].refuel * points[i].cost
  }
  return { totalFuel, totalCost }
}

const renderData = (points, fuel) => {
  points = points.filter(p => p.type !== 4 && p.type !== 3)
  // console.log(fuel)

  let start = points[0]
  let res = [{
    route: getAddressText(start.address).main || start.name,
    load: (start.load || ''),
    unload: (start.unload || ''),
    boughtFuel: (start.refuel || ''),
    residualFuel: '',
    fuelCost: start.cost
  }]

  for (let i = 1; i < points.length; ++i) {
    const startLabel = getAddressText(start.address).main || start.name
    let finishLabel = getAddressText(points[i].address).main || points[i].name
    if (points[i].type === 2) finishLabel += '(запр)'
    const newPoint = {
      route: `${startLabel} -> ${finishLabel} `,
      load: (points[i].load || ''),
      unload: (points[i].unload || ''),
      residualFuel: (points[i].residualFuel || ''),
      boughtFuel: (points[i].refuel || ''),
      fuelCost: (points[i].cost || '')
    }
    // fuel += (points[i].refuel || 0)
    res = [...res, newPoint]

    start = points[i]
  }

  return res
}
