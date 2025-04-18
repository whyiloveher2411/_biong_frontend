import { colors } from "@mui/material"

const white = '#FFFFFF'
const black = '#000000'

export default {
    type: 'light',
    mode: 'light',
    black,
    white,
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
        primary: '#263238',
        secondary: '#546e7a',
        third: '#607d8b',
        link: '#1e88e5',
    },
    buttonSave: {
        contrastText: white,
        dark: colors.green[900],
        main: colors.green[600],
        light: colors.green[100],
    },
    link: colors.blue[800],
    icon: colors.blueGrey[600],
    background: {
        // default: '#F4F6F8',
        default: white,
        paper: white,
    },
    backgroundSelected: '#f6f7f9',
    divider: colors.grey[200],
    dividerDark: '#e0e0e0',
    body: {
        // background: '#f0f2f5'
        background: white
    },
    header: {
        background: white
    },
    footer: {
        background: '#f8f9fa',
    },
    menu: {
        background: '#fff'
    },
    fileSelected: '#d4d4d4',
    fileDropSelected: '#ededed',
    commentItemBackground: '#f0f2f5',
}
