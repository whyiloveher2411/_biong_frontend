import React from 'react'
import Prism from 'prismjs';
import "prismjs/themes/prism-okaidia.min.css";
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/autoloader/prism-autoloader.min.js';

// Cấu hình autoloader
Prism.plugins.autoloader.languages_path = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';

import { Box, BoxProps, Theme } from '@mui/material';
import { __ } from 'helpers/i18n';
import { makeStyles } from '@mui/styles';


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


const CodeBlock = React.forwardRef(({
    html,
    sx,
    disableCopyButton,
    changeLinks,
    ...rest }: BoxProps & { html: string, disableCopyButton?: boolean, changeLinks?: { source: string, to: string } }, ref: React.ForwardedRef<HTMLElement>) => {

    const classes = useStyles()


    React.useEffect(() => {

        document.querySelectorAll('.codeBlock:not(.disableCopy) pre').forEach(pre => {
            if (pre.classList.length === 0) {
                pre.classList.add(pre.querySelector('code')?.classList.item(0) ?? 'language-pseudo');
            }
        });

        // Chuyển đổi ngôn ngữ codebyte/golang thành go
        document.querySelectorAll('.codeBlock pre').forEach(pre => {
            const codeElement = pre.querySelector('code');


            if (codeElement) {
                const languageClass = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'));
                if (languageClass) {
                    const originalLanguage = languageClass.replace('language-', '').replace('codebyte/', '');
                    const convertedLanguage = convertLanguage(originalLanguage);
                    const newLanguageClass = `language-${convertedLanguage}`;
                    codeElement.className = newLanguageClass;
                    pre.className = newLanguageClass;
                }

                const languageClass2 = Array.from(codeElement.classList).find(cls => cls.startsWith('lang-'));
                if (languageClass2) {
                    const originalLanguage = languageClass2.replace('lang-', '').replace('codebyte/', '');
                    const convertedLanguage = convertLanguage(originalLanguage);
                    const newLanguageClass = `language-${convertedLanguage}`;
                    codeElement.className = newLanguageClass;
                    pre.className = newLanguageClass;
                }
            }
        });

        Prism.highlightAll();

        document.querySelectorAll('.codeBlock:not(.disableCopy) pre').forEach(pre => {

            if (!pre.closest('.pre-wrapper')) {
                pre.classList.add('pre-wrappered');

                // Di chuyển thẻ pre vào một thẻ div mới với class 'pre-wrapper'
                const preWrapper = document.createElement('div');
                preWrapper.className = 'pre-wrapper';

                
                const preWrapperToolbar = document.createElement('div');
                preWrapperToolbar.className = 'pre-toolbar';
                pre.parentElement?.insertBefore(preWrapperToolbar, pre);

                preWrapper?.insertBefore(preWrapperToolbar, preWrapper.firstChild);
                preWrapper?.appendChild(preWrapperToolbar);

                pre.parentElement?.insertBefore(preWrapper, pre);

                preWrapper?.appendChild(pre);


                let button = document.createElement('button');
                button.classList.add('btnCopyCode');

                button.innerHTML = 'Copy';
                button.title = 'Copy Code';
                button.addEventListener('click', function () {
                    const content = this.closest('.pre-wrapper')?.querySelector('pre')?.textContent;
                    if (content) {
                        navigator.clipboard.writeText(content);
                        window.showMessage(__('Đã copy code đến clipboard.'), 'info');
                    }
                });

                const languageLabel = document.createElement('div');
                languageLabel.className = 'pre-toolbar-language';
                const languageClass = pre.querySelector('code')?.classList.item(0);
                let languageName = 'Pseudo';
                if (languageClass) {
                    languageName = languageClass.replace('language-', '');
                }
                languageLabel.innerHTML = languageName;
                preWrapperToolbar.append(languageLabel);
                preWrapperToolbar.append(button);

            }
        });

    }, [html, rest.children]);

    return (
        <Box
            ref={ref}
            className={"codeBlock line-numbers " + (disableCopyButton ? 'disableCopy' : ' ') + classes.root}
            {...rest}
            sx={[(theme) => ({
                position: 'relative',
                '& *': {
                    userSelect: 'text',
                },
                '& .line-numbers-rows': {
                    bottom: -2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
                '& .btnCopyCode': {
                    // position: 'absolute',
                    // top: 6,
                    right: 6,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    p: 1,
                    pt: '7px',
                    pb: '6px',
                    borderRadius: 1,
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'center',
                    fontSize: 10,
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                    '& .MuiSvgIcon-root': {
                        width: 14,
                        height: 14,
                        fill: 'white',
                    }
                },
                'pre[class*=language-]': {
                    // padding: '2rem',
                    marginTop: 0,
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
                    padding: '2px 6px',
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
                    backgroundColor: 'transparent !important',
                },
                '& pre code': {
                    padding: '0',
                    whiteSpace: 'break-spaces',
                },
                '& img': {
                    borderRadius: '3px',
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
                '& .pre-wrapper': {
                    position: 'relative',
                    backgroundColor: 'rgb(13 13 13/1)',
                    borderRadius: 2,
                    overflow: 'hidden',
                },
                '& .pre-toolbar': {
                    backgroundColor: '#2f2f2f',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    gap: '4px',
                    padding: '8px 16px',
                    color: '#b4b4b4',
                }
            }),
            (theme) => ({
                ...(typeof sx === 'function' ? sx(theme) : sx ?? {}),
            })
            ]}

        >
            <Box
                className='codeBlock-content'
                dangerouslySetInnerHTML={{
                    __html: changeLinks
                        ? html.replace(
                            /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g,
                            (match, quote, url) => {
                                return `<a href=${quote}${url.replace(changeLinks.source, changeLinks.to)}${quote}`;
                            }
                        )
                        : html
                }}
            />
            {rest.children}
        </Box>
    );
})

export default CodeBlock

function convertLanguage(language: string): string {
    const languageMap: { [key: string]: string } = {
        golang: 'go',
        javascript: 'js',
        typescript: 'ts',
        python: 'py',
        csharp: 'cs',
        cplusplus: 'cpp',
        'c++': 'cpp',
        markdown: 'md',
        // Thêm các ngôn ngữ khác nếu cần
    };

    return languageMap[language.toLowerCase()] || language;
}