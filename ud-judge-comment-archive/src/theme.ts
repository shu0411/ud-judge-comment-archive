import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export const HEADER_HEIGHT = 56
export const DRAWER_WIDTH = 256

const theme = responsiveFontSizes(
  createTheme({
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: '#F8FAFC',
            paper: '#F8FAFC',
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: '#1E293B',
            paper: '#1E293B',
          },
        },
      },
    },
  }),
)

export default theme
