import { colors } from "@mui/material"

const white = '#FFFFFF'

export default {
    type: 'dark',
    mode: 'dark',
    primary: {
        contrastText: white,
        dark: colors.blue[900],
        main: colors.blue[700],
        light: colors.blue[300],
    },
    secondary: {
        contrastText: white,
        dark: colors.red[900],
        main: colors.red[700],
        light: colors.red[400],
    },
    success: {
        contrastText: white,
        dark: colors.green[900],
        main: colors.green[600],
        light: colors.green[400],
    },
    error: {
        contrastText: white,
        dark: colors.red[900],
        main: colors.red[600],
        light: colors.red[400],
    },
    text: {
        primary: '#e4e6eb',
        secondary: '#b0b3b8',
        third: '#989898',
        link: '#90caf9',
    },
    buttonSave: {
        contrastText: white,
        dark: colors.green[900],
        main: colors.green[600],
        light: colors.green[100],
    },
    link: colors.blue[800],
    icon: '#fff',
    background: {
        default: '#303030',
        paper: '#242526',
    },
    backgroundSelected: '#484848',
    divider: '#353535',
    dividerDark: '#353535',
    body: {
        background: '#181818'
    },
    header: {
        background: '#424242'
    },
    menu: {
        background: '#242526'
    },
    fileSelected: '#484848',
    fileDropSelected: '#353535',
    commentItemBackground: '#3a3b3c',
}
