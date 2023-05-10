import React from 'react'
import Prism from 'prismjs';
import "prismjs/themes/prism-okaidia.min.css";
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import { Box, BoxProps } from '@mui/material';
import { __ } from 'helpers/i18n';

const CodeBlock = React.forwardRef(({ html, sx, ...rest }: BoxProps & { html: string }, ref) => {

    React.useEffect(() => {
        Prism.highlightAll();

        document.querySelectorAll('.codeBlock pre').forEach(pre => {
            if (!pre.querySelector('.btnCopyCode')) {
                let button = document.createElement('button');
                button.classList.add('btnCopyCode');

                button.innerHTML = '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ContentCopyOutlinedIcon"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>';

                button.addEventListener('click', function () {
                    const content = pre.querySelector('code')?.textContent;
                    if (content) {
                        navigator.clipboard.writeText(content);
                        window.showMessage(__('Đã copy đến clipboard.'), 'info');
                    }
                });
                pre.append(button);
            }
        });

    }, [html]);

    return (
        <Box
            ref={ref}
            className="codeBlock line-numbers"
            {...rest}
            sx={[(theme) => ({
                '& *': {
                    userSelect: 'text',
                },
                '& .btnCopyCode': {
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    p: 1,
                    pt: '7px',
                    pb: '6px',
                    borderRadius: 1,
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                    '& .MuiSvgIcon-root': {
                        width: 18,
                        height: 18,
                        fill: 'white',
                    }
                },
                '& ul, & ol': {
                    pl: 2,
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
                    fontFamily: 'Hack-ZeroSlash,monospace',
                    overflowWrap: 'anywhere',
                    padding: '0 4px',
                    ...(theme.palette.mode === 'light' ? {
                        backgroundColor: 'rgba(9,30,66,0.22)',
                        color: '#172b4d',
                        '--color': '#172b4d',
                    } : {
                        backgroundColor: '#3b3b4f',
                        color: '#dfdfe2',
                        '--color': '#dfdfe2',
                    }),
                },
                '& pre': {
                    position: 'relative',
                },
                '& pre code': {
                    padding: '0',
                    whiteSpace: 'break-spaces',
                },
                '& img': {
                    borderRadius: '3px',
                    // backgroundColor: '#ebecf0',
                    boxShadow: 'rgb(9 30 66 / 20%) 0px 1px 1px, rgb(9 30 66 / 24%) 0px 0px 1px 0px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: '100%',
                    height: 'auto',
                },
                '& figcaption': {
                    marginTop: '-22px',
                    textAlign: 'center',
                    opacity: 0.8,
                    fontSize: 16,
                    fontStyle: 'italic',
                },
            }),
            (theme) => ({
                ...(typeof sx === 'function' ? sx(theme) : sx ?? {}),
            })
            ]}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
})

export default CodeBlock