import React from 'react'
import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";
import { Box, BoxProps } from '@mui/material';

function CodeBlock({ html, ...rest }: BoxProps & { html: string }) {
    React.useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <Box
            {...rest}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default CodeBlock