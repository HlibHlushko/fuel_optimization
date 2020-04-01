import { withStyles } from '@material-ui/core/styles'

import { styles } from './styles'
import { MyTable as Component } from './Table'

export const Table = withStyles(styles)(Component)
