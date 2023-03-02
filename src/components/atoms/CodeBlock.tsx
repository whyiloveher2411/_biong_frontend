import React from 'react'
import Prism from 'prismjs';
import "prismjs/themes/prism-okaidia.min.css";
import { Box, BoxProps } from '@mui/material';

const CodeBlock = React.forwardRef(({ html, sx, ...rest }: BoxProps & { html: string }, ref) => {
    React.useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <Box
            ref={ref}
            className="codeBlock"
            {...rest}
            sx={{
                '& *': {
                    userSelect: 'text',
                },
                '& a': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                    '&:hover': {
                        opacity: 0.7,
                        textDecoration: 'underline',
                    }
                },
                '& blockquote': {
                    pl: 2.5,
                    borderLeft: '3px solid',
                    borderColor: 'dividerDark',
                    margin: '0.75rem 0px 0px',
                },
                '& code': {
                    backgroundColor: '#3b3b4f',
                    color: '#dfdfe2',
                    '--color': '#dfdfe2',
                    fontFamily: 'Hack-ZeroSlash,monospace',
                    overflowWrap: 'anywhere',
                    padding: '0 4px',
                    whiteSpace: 'inherit',
                },
                '& img': {
                    borderRadius: '3px',
                    backgroundColor: '#ebecf0',
                    boxShadow: 'rgb(9 30 66 / 20%) 0px 1px 1px, rgb(9 30 66 / 24%) 0px 0px 1px 0px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                },
                ...sx
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
})

export default CodeBlock