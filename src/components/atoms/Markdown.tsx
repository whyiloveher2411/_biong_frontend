import { Box, SxProps, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { addClasses } from 'helpers/dom'
import MarkdownToJsx from 'markdown-to-jsx'
import Prism from 'prismjs'
import "prismjs/themes/prism-tomorrow.css"
import { useEffect } from 'react'
import remarkGfm from 'remark-gfm'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& h1': {
            ...theme.typography.h1,
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(7),
            fontWeight: 'bold',
        },
        '& h2': {
            ...theme.typography.h2,
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(6),
            fontWeight: 'bold',
        },
        '& h3': {
            ...theme.typography.h3,
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(5),
            fontWeight: 'bold',
        },
        '& h4': {
            ...theme.typography.h4,
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(4),
            fontWeight: 'bold',
        },
        '& h5': {
            ...theme.typography.h5,
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(3),
            fontWeight: 'bold',
        },
        '& h6': {
            ...theme.typography.h6,
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(2),
            fontWeight: 'bold',
        },
        '& p': {
            ...theme.typography.subtitle1,
            marginBottom: theme.spacing(2),
        },
        '& ul': {
            marginLeft: theme.spacing(3),
            marginBottom: theme.spacing(2),
        },
        '& ol': {
            marginLeft: theme.spacing(3),
            marginBottom: theme.spacing(2),
        },
        '& li': {
            ...theme.typography.subtitle1,
            marginBottom: theme.spacing(1),
        },
        '& hr': {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            backgroundColor: theme.palette.divider,
            border: 0,
            height: 1,
        },
        '& a': {
            color: theme.palette.link,
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        '& table': {
            width: '100%',
        },
        '& table, & th, & td': {
            borderCollapse: 'collapse',
            border: `1px solid ${theme.palette.divider}`,
            lineHeight: '30px',
            paddingLeft: '8px',
            paddingRight: '8px',
            textAlign: 'left',
        },
        '& tr': {
            backgroundColor: theme.palette.background.paper,
        },
        '& tbody tr:nth-child(odd)': {
            backgroundColor: theme.palette.divider,
        },
    },
}))

const Markdown = ({ className = '', sx = {}, ...rest }: { [key: string]: ANY, className?: string, sx?: SxProps, children: string }) => {

    const classes = useStyles()

    useEffect(() => {
        setTimeout(() => Prism.highlightAll(), 0)
    }, [])

    return (
        <Box className={addClasses({ [classes.root]: true, [className]: true, 'markdown': true })} sx={sx}>
            <MarkdownToJsx remarkPlugins={[remarkGfm]} {...rest} />
        </Box >
    )
}

export default Markdown
