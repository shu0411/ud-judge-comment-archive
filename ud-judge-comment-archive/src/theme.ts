import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export const HEADER_HEIGHT = 56
export const DRAWER_WIDTH = 256
export const RAIL_WIDTH = 40

const theme = responsiveFontSizes(
  createTheme({
    colorSchemes: { light: true, dark: true },
  }),
)

export default theme
