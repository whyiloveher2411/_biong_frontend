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
            {...rest}
            sx={{
                '& code': {
                    backgroundColor: '#3b3b4f',
                    color: '#dfdfe2',
                    fontFamily: 'Hack-ZeroSlash,monospace',
                    overflowWrap: 'anywhere',
                    padding: '0 4px',
                },
                ...sx
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
})

export default CodeBlock