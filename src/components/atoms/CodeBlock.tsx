import React from 'react'
import Prism from 'prismjs';
import "prismjs/themes/prism-okaidia.min.css";
import { Box, BoxProps } from '@mui/material';

const CodeBlock = React.forwardRef(({ html, ...rest }: BoxProps & { html: string }, ref) => {
    React.useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <Box
            ref={ref}
            {...rest}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
})

export default CodeBlock