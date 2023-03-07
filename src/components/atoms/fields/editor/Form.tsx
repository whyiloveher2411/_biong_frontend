import { Theme, useTheme } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import FormControl from 'components/atoms/FormControl'
import makeCSS from 'components/atoms/makeCSS'
import TextField from 'components/atoms/TextField'
import { makeid } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import { addScript } from 'helpers/script'
import React from 'react'
import SpecialNotes from '../SpecialNotes'
import { FieldFormItemProps } from '../type'
import Loading from 'components/atoms/Loading'

const useStyles = makeCSS((theme: Theme) => ({
    root: {
        '& .tox-editor-header': {
            width: 'var(--width)',
            zIndex: 1,
        },
        '& .tox .tox-toolbar--scrolling': {
            flexWrap: 'wrap',
        },
        '& .tox-edit-area': {
            paddingTop: 'var(--toxHeaderHeight)',
        },
    },
    darkMode: {
        '& .tox .tox-menubar': {
            borderBottom: '1px solid ' + theme.palette.dividerDark,
        },
        '& .tox .tox-toolbar>*': {
            borderBottom: '1px solid ' + theme.palette.dividerDark,
            marginBottom: -1
        },
        '& .tox:not(.tox-tinymce-inline) .tox-editor-header': {
            borderBottom: '1px solid ' + theme.palette.dividerDark,
        },
        '& .tox .tox-menubar, & .tox .tox-toolbar,& .tox .tox-toolbar__overflow,& .tox .tox-toolbar__primary, & .tox .tox-statusbar, & .tox .tox-edit-area__iframe': {
            background: theme.palette.background.paper,
        },
        '& .tox-tinymce, & .tox:not([dir=rtl]) .tox-toolbar__group:not(:last-of-type), & .tox .tox-statusbar': {
            borderColor: theme.palette.dividerDark,
        },
        '& .tox .tox-mbtn, & .tox .tox-tbtn, & .tox .tox-statusbar a,& .tox .tox-statusbar__wordcount, & .tox .tox-statusbar__path-item, & .tox .tox-edit-area__iframe': {
            color: theme.palette.text.secondary,
            '--color': theme.palette.text.secondary,
            cursor: 'pointer',
        },
        '& .tox .tox-tbtn svg': {
            fill: theme.palette.text.secondary,
        },
        '& .tox .tox-tbtn:hover svg, & .tox .tox-tbtn--enabled svg, & .tox .tox-tbtn--enabled:hover svg, .tox .tox-tbtn:active svg,& .tox .tox-tbtn:focus:not(.tox-tbtn--disabled) svg': {
            fill: theme.palette.text.primary,
        },
        '& .tox .tox-mbtn:hover:not(:disabled):not(.tox-mbtn--active), & .tox .tox-tbtn:active, & .tox .tox-mbtn--active, & .tox .tox-mbtn:focus:not(:disabled), & .tox .tox-tbtn:hover, & .tox .tox-tbtn--enabled,& .tox .tox-tbtn--enabled:hover, &.tox .tox-tbtn:focus:not(.tox-tbtn--disabled)': {
            backgroundColor: theme.palette.backgroundSelected,
            color: theme.palette.text.primary,
            cursor: 'pointer',
        }
    },
    editor: {
        '&>.MuiInputLabel-outlined.MuiInputLabel-shrink': {
            transform: 'translate(14px, -11px) scale(0.75)'
        },
        '&>.MuiInputBase-root>textarea, &>label': {
            lineHeight: 2.2
        },
        '&>.MuiOutlinedInput-root': {
            padding: 0,
        },
        '& .tox.tox-tinymce': {
            width: '100%',
        }
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        color: '#fff'
    },
}))

export default React.memo(function TextareaForm({ config, post, name, onReview }: FieldFormItemProps) {

    const theme = useTheme();

    const classes = useStyles()

    const [id, setId] = React.useState<string | false>(false);

    const valueInital = post && post[name] ? post[name] : '';
    const [value, setValue] = React.useState(0);
    const [loadScript, setLoadScript] = React.useState(false);

    const [isLoadedEditor, setIsloadedEditor] = React.useState(false);


    const [, setOpenFilemanagerDialog] = React.useState(false);
    const [, setFileType] = React.useState<string[]>([]);

    const [, setEditor] = React.useState<ANY>(null);

    let interval: NodeJS.Timeout;

    React.useEffect(() => {

        let id = 'editor_' + makeid(10, 'editor');

        while (document.getElementById(id)) {
            id = 'editor_' + makeid(10, 'editor');
        }

        setId(id);


        addScript('/admin/tinymce/tinymce.min.js', 'tynymce', function () {
            if (!window.tinymce) {
                reloadEditor();
            } else {
                setLoadScript(true);
            }
        });

        // if (!document.getElementById('tynymce')) {

        //     const script = document.createElement("script");
        //     script.id = 'tynymce';
        //     script.src = '/admin/tinymce/tinymce.min.js';
        //     script.async = true;

        //     script.onload = () => {
        //         setLoadScript(true);
        //     };
        //     document.body.appendChild(script);

        // } else {

        //     if (!window.tinymce) {
        //         reloadEditor();
        //     } else {
        //         setLoadScript(true);
        //     }
        // }

        return () => {
            window.tinymce?.get(id)?.remove();
        };

    }, []);

    const reloadEditor = () => {
        interval = setInterval(() => {
            if (window.tinymce) {
                setLoadScript(true);
                clearInterval(interval);
            }
        }, 10);
    }


    const handleClickOpenFilemanagerDialog = () => {
        setOpenFilemanagerDialog(true);
    };

    const handleScrollWarperMain = () => {

        document.querySelectorAll('.warpper-editor').forEach(function (el) {

            let $menubar = el.querySelector('.tox-editor-header');

            if ($menubar) {

                //eslint-disable-next-line
                //@ts-ignore
                el.setAttribute('style', '--width:' + (el.offsetWidth - 2) + 'px; --toxHeaderHeight:' + $menubar.offsetHeight + 'px;');

                let $tinymce_editor = el.querySelector('.tox-tinymce'),
                    top = el.getBoundingClientRect().top, dk = false;

                //eslint-disable-next-line
                //@ts-ignore
                if ($tinymce_editor.style.opacity === 1) {
                    //eslint-disable-next-line
                    //@ts-ignore
                    dk = top + el.offsetHeight > 356 + $menubar.offsetHeight;
                } else {
                    //eslint-disable-next-line
                    //@ts-ignore
                    dk = top + el.offsetHeight > 356;
                }

                let positionTop = (document.getElementById('header-top')?.clientHeight ?? 0) + (document.getElementById('header-section-top')?.clientHeight ?? 0);

                if (top <= positionTop && dk) {
                    //eslint-disable-next-line
                    //@ts-ignore
                    Object.assign($menubar.style, { position: 'fixed', top: positionTop + 'px', left: 'unset' });
                } else {
                    //eslint-disable-next-line
                    //@ts-ignore
                    Object.assign($menubar.style, { position: 'absolute', top: '0', left: '0' });
                }
            }
        });

    }

    React.useEffect(() => {

        if (loadScript) {
            if (!config.disableScrollToolBar) {
                //eslint-disable-next-line
                //@ts-ignore
                if (!document.querySelector('#warperMain').classList.contains('hasEventScroll')) {
                    //eslint-disable-next-line
                    //@ts-ignore
                    document.querySelector('#warperMain').classList.add('hasEventScroll');

                    //eslint-disable-next-line
                    //@ts-ignore
                    document.querySelector('#warperMain')?.addEventListener('scroll', function () {
                        handleScrollWarperMain();
                    });
                }

            }

            window.tinymce?.get(id)?.remove();
            if (window.tinymce) {
                window.tinymce.init({
                    selector: '#' + id,
                    // auto_resize: true,
                    // toolbar_sticky: true,
                    placeholder: config.inputProps?.placeholder ?? __('Write something awesome...'),
                    height: config.inputProps?.height ?? 800,
                    verify_html: false,
                    skin: 'oxide' + (theme.palette.mode === 'dark' ? '-dark' : ''),
                    extended_valid_elements: true,
                    branding: false,
                    fontsize_formats: "8px 10px 12px 14px 16px 18px 24px 36px 48px 72px",
                    setup: function (editor: ANY) {

                        // editor.on('click', function (e: Event) {
                        //     e.preventDefault();
                        //     e.stopPropagation();
                        // });


                        editor.on('focusout', function () {
                            onReview(editor.getContent(), name);
                        });

                        if (config.editorObjectName) {
                            if (!window.__editor) {
                                window.__editor = {};
                            }
                            window.__editor[config.editorObjectName] = editor;
                        }

                        if( config.setup ){
                            config.setup(editor);
                        }

                        editor.on('change', function () {
                            editor.save();
                        });

                        editor.on('init', function (_args: ANY) {
                            setEditor(editor);

                            if (!config.disableScrollToolBar) {
                                handleScrollWarperMain();
                            }

                            let css = ':root { --color: ' + theme.palette.text.primary + ' }.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before{color: ' + theme.palette.text.secondary + ';opacity:0.7}',
                                head = document.head || document.getElementsByTagName('head')[0],
                                style = document.createElement('style');

                            head.appendChild(style);

                            editor.dom.$('head').append(style);

                            style.type = 'text/css';

                            //@ts-ignore
                            if (style.styleSheet) {
                                //@ts-ignore
                                style.styleSheet.cssText = css;
                            } else {
                                style.appendChild(document.createTextNode(css));
                            }

                        });

                        setIsloadedEditor(true);
                    },
                    formats: {
                        underline: { inline: 'u', exact: true }
                    },

                    plugins: config.plugins ? config.plugins : [
                        'advlist codesample powerpaste wordcount autolink template lists link image charmap print preview anchor searchreplace visualblocks help insertdatetime media table'
                    ],
                    toolbar: config.toolbar ? config.toolbar : ['fontselect |  fontsizeselect | sizeselect | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | forecolor backcolor | bullist numlist outdent indent | link image media | codesample code | removeformat'],
                    codesample_languages: [
                        { text: 'HTML/XML', value: 'markup' },
                        { text: 'JavaScript', value: 'javascript' },
                        { text: 'CSS', value: 'css' },
                        { text: 'PHP', value: 'php' },
                        { text: 'Ruby', value: 'ruby' },
                        { text: 'Python', value: 'python' },
                        { text: 'Java', value: 'java' },
                        { text: 'C', value: 'c' },
                        { text: 'C#', value: 'csharp' },
                        { text: 'C++', value: 'cpp' }
                    ],
                    file_browser_callback_types: 'file image media',
                    automatic_uploads: false,
                    autoresize_on_init: false,
                    template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
                    template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
                    body_class: 'editor-content',
                    powerpaste_word_import: 'prompt',
                    powerpaste_html_import: 'prompt',
                    content_css: [
                        '/admin/tinymce/themes/article.css',
                    ],
                    // external_filemanager_path: process.env.REACT_APP_BASE_URL,
                    OpenFileManager: (type: string[]) => {
                        setFileType(type);
                        handleClickOpenFilemanagerDialog();
                    },
                    filemanager_title: "Quản lý file",
                    ...config.inputProps,
                });
            }
        }

    }, [loadScript, theme]);

    React.useEffect(() => {

        return () => {
            if (config.editorObjectName && window.__editor && window.__editor[config.editorObjectName]) {
                delete window.__editor[config.editorObjectName];
            }
        };

    }, []);

    if (id) {

        return (<>
            {
                !isLoadedEditor &&
                <Box
                    sx={{
                        maxWidth: '100%',
                        height: config.inputProps?.height ? config.inputProps.height : 300,
                        position: 'relative',
                    }}
                >
                    <Loading open={true} isCover />
                </Box>
            }
            <Box
                sx={{
                    maxWidth: '100%',
                    height: config.inputProps?.height ? config.inputProps.height : 300,
                    position: !isLoadedEditor ? 'absolute' : 'relative',
                    opacity: !isLoadedEditor ? 0 : 1,
                }}
            ><FormControl error={config.inputProps?.error} size={config.size ?? 'medium'} fullWidth variant="outlined">
                    {
                        Boolean(config.title) &&
                        <InputLabel {...config.labelProps} sx={{ marginBottom: 4 }}>{config.title}</InputLabel>
                    }
                    <SpecialNotes specialNotes={config.special_notes} />
                    <div className={classes.root + " warpper-editor " + (theme.palette.mode === 'dark' ? classes.darkMode : '')} >
                        <TextField
                            fullWidth
                            multiline
                            className={classes.editor}
                            variant="outlined"
                            name={name}
                            value={valueInital}
                            id={id}
                            onBlur={e => { onReview(e.target.value, name) }}
                            onChange={e => { setValue(value + 1); post[name] = e.target.value }}
                        />
                    </div>
                    {
                        config.note ?
                            <FormHelperText error={config.inputProps?.error}><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
                            : null
                    }
                </FormControl>
            </Box>

        </>
        )
    }
    return null;
}, (props1, props2) => {
    return props1.post[props1.name] === props2.post[props2.name] && props1.config.note === props2.config.note;
})
