import React from 'react'
import Line from 'react-chartjs-2'
import 'chartjs-plugin-dragdata'
import '../../fonts/fonts.css'
import TextField from '@material-ui/core/TextField'

export class Chart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      labels: []
    }
  }

  inputChanged (id, event) {
    const { data, onChangeChart } = this.props
    if (!isNaN(event.target.value) && event.target.value >= 0) {
      const lastLabel = data.length - 1
      const newData = [...data.slice(0, id * lastLabel), event.target.value, ...data.slice(id * lastLabel + 1)]
      const firstEl = newData[0] === '' ? 0 : newData[0]
      const lastEl = newData[lastLabel] === '' ? 0 : newData[lastLabel]
      const k = (parseFloat(lastEl) - parseFloat(firstEl)) / (newData.length - 1)
      const intermData = []
      for (let i = 1; i < newData.length - 1; i++) {
        const d = i * k + parseFloat(firstEl)
        intermData.push(d.toFixed(1))
      }
      intermData.unshift(firstEl)
      intermData.push(lastEl)
      onChangeChart(intermData)
    }
  }

  componentDidMount () {
    this.setState({
      labels: [0, this.props.data.length - 1]
    })
  }

  render () {
    const options = {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: false,
            labelString: 'tons',
            fontColor: '#3C3C3C',
            fontSize: 18,
            fontFamily: 'TT Commons',
            fontStyle: 'bold'
          },
          position: 'inside',
          ticks: {
            fontColor: '#3C3C3C',
            fontSize: 14,
            fontFamily: 'TT Commons',
            fontStyle: 'bold',
            display: true,
            min: 0,
            max: 100,
            scaleSteps: 10,
            scaleStartValue: 0,
            maxTicksLimit: 31,
            padding: -25
          },
          gridLines: {
            display: true,
            offsetGridLines: false,
            color: 'rgb(193,194,197, 0.3)',
            lineWidth: 2,
            borderDash: [3.5, 3.5],
            tickMarkLength: 10
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'liters',
            fontColor: '#3C3C3C',
            fontSize: 18,
            fontFamily: 'TT Commons',
            fontStyle: 'bold'
          },
          ticks: {
            display: true,
            min: 0,
            max: (Math.ceil(Math.max(...this.props.data) / 10)) * 10,
            scaleSteps: 5,
            scaleStartValue: 0,
            maxTicksLimit: 10,
            fontColor: '#3C3C3C',
            fontSize: 14,
            fontStyle: 'bold',
            fontFamily: 'TT Commons',
            padding: 10,
            dragData: true,
            suggestedMin: 0,
            beginAtZero: true,
            callback: point => (point < 0 ? '' : point)
          },
          gridLines: {
            display: true,
            offsetGridLines: false,
            color: 'rgb(193,194,197, 0.3)',
            lineWidth: 2,
            borderDash: [3.5, 3.5],
            tickMarkLength: 10
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      dragData: true,
      maintainAspectRatio: false,

      onDragEnd: (e, datasetIndex, index, value) => {
        const lastLabel = this.props.data.length - 1
        const newData = [...this.props.data.slice(0, index * lastLabel), parseFloat(value.toFixed(1)), ...this.props.data.slice(index * lastLabel + 1)]
        const firstEl = parseFloat(newData[0])
        const lastEl = parseFloat(newData[lastLabel])
        const k = (lastEl - firstEl) / (newData.length - 1)
        const intermData = []
        for (let i = 1; i < newData.length - 1; i++) {
          const d = i * k + firstEl
          intermData.push(parseFloat(d.toFixed(1)))
        }
        intermData.unshift(firstEl)
        intermData.push(lastEl)
        this.props.onChangeChart(intermData)
      }
    }
    const data = {
      labels: this.state.labels,
      datasets: [{
        data: this.props.data.filter((item, index) => index === 0 || index === this.props.data.length - 1),
        borderColor: '#FF507C',
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#FF507C',
        pointBorderWidth: 0,
        spanGaps: true,
        backgroundColor: 'rgba(255, 80, 124, 0.12)'
      }],
      type: 'line'
    }
    const { classes } = this.props
    const a = this.props.data.filter((item, index) => index === 0 || index === this.props.data.length - 1)

    return (
      <div className={classes.chart}>
        <Line
          width={100}
          height={300}
          data={data}
          options={options}
          type='line'
        />
        <div className={classes.chartInputs}>
          {
            a.map((item, id) =>
              <TextField
                key={id}
                className={classes.textField}
                value={item}
                variant='outlined'
                onChange={this.inputChanged.bind(this, id)}
                InputProps={{
                  classes: {
                    input: classes.textFieldProps
                  }
                }}
              />
            )
          }
        </div>
      </div>
    )
  }
}
