import { Box, Button, Grid, IconButton, ListItemIcon, MenuItem, MenuList, Typography, Link as MuiLink } from '@mui/material';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import MenuPopover from 'components/atoms/MenuPopover';
import { getLanguages, LanguageProps, __ } from 'helpers/i18n';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store/configureStore';
import { change as changeLanguage } from "store/language/language.reducers";
import { refreshScreen } from 'store/user/user.reducers';
import * as ReactDOMServer from 'react-dom/server';

export default function Footer() {

    const anchorRef = React.useRef(null);

    const language = useSelector((state: RootState) => state.language);

    const dispatch = useDispatch();

    const [langObj, setLangObj] = React.useState<{
        open: boolean,
        languages: Array<LanguageProps>
    }>({
        open: false,
        languages: []
    });

    const renderMenuLanguage = (
        <MenuPopover
            style={{ zIndex: 999 }}
            open={langObj.open}
            anchorEl={anchorRef.current}
            onClose={() => {
                setLangObj(prev => ({
                    ...prev,
                    open: false
                }))
            }}
            PaperProps={{
                sx: {
                    minWidth: 280,
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                },
                className: 'custom_scroll'
            }}
        >
            <MenuList
                autoFocusItem={langObj.open}
            >
                {
                    langObj.languages.map(option => (
                        <MenuItem
                            key={option.code}
                            selected={option.code === language.code}
                            sx={{
                                minHeight: 36,
                                height: 36,
                            }}
                            onClick={() => {
                                if (option.code !== language.code) {
                                    dispatch(changeLanguage(option));
                                    dispatch(refreshScreen()); //Refresh website
                                    setLangObj(prev => ({
                                        ...prev,
                                        open: false,
                                    }))
                                }
                            }}>
                            <ListItemIcon>
                                <img
                                    loading="lazy"
                                    width="20"
                                    src={`https://flagcdn.com/w20/${option.flag.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${option.flag.toLowerCase()}.png 2x`}
                                    alt=""
                                />
                            </ListItemIcon>
                            <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="inherit" noWrap>
                                    {option.label} {option.note && '(' + option.note + ')'}
                                </Typography>
                                {
                                    option.code === language.code && <Icon icon="Check" />
                                }
                            </Box>
                        </MenuItem>
                    ))
                }

            </MenuList>
        </MenuPopover >
    );

    return (
        <>
            <Box
                sx={{
                    pt: 1.25,
                    mt: 5,
                    background: '#333',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 1280,
                        maxWidth: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        p: 4,
                    }}
                >

                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <Link to="/about" color="inherit">About</Link>
                            <Link to="/about" color="inherit">Service</Link>
                            <Link to="/explore" color="inherit">Explore</Link>
                            <Link to="/carrers" color="inherit">Careers</Link>
                            <Link to="/press" color="inherit">Press</Link>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <Link to="/help" color="inherit">Help</Link>
                            <Link to="/advertise" color="inherit">Advertise</Link>
                            <Link to="/developers" color="inherit">Developers</Link>
                            <Link to="/contact-us" color="inherit">Contact Us</Link>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <Link to="/terms/copyright-policy" color="inherit">Copyright Policy</Link>
                            <Link to="/terms" color="inherit">Terms</Link>
                            <Link to="/terms/privacy-policy" color="inherit">Privacy Policy</Link>
                            <Link to="/sitemap" color="inherit">Sitemap</Link>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 1,
                            }}
                        >
                            <Box>
                                <Button
                                    component={Link}
                                    to="/contact-us"
                                    color="secondary"
                                    variant='contained'
                                    sx={{ textTransform: 'none' }}>
                                    {__('Teach on Cursus')}
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    ref={anchorRef}
                                    sx={{ textTransform: 'none' }}
                                    variant='outlined'
                                    color="inherit"
                                    startIcon={<Icon icon="LanguageOutlined" />}
                                    endIcon={<Icon icon="ArrowDropDownOutlined" />}
                                    onClick={() => {
                                        setLangObj(prev => {
                                            if (prev.languages.length) {
                                                return {
                                                    ...prev,
                                                    open: true,
                                                };
                                            } else {
                                                return {
                                                    open: true,
                                                    languages: getLanguages()
                                                }
                                            }
                                        });
                                    }}
                                >
                                    {__('Language')}
                                </Button>
                            </Box>

                            <Typography variant='body2'
                                sx={{
                                    textAlign: 'right',
                                    maxWidth: 160
                                }}
                                color="white"
                            >
                                {__('We don\'t really understand your culture nor language, so help us to improve it')} <MuiLink href="#" >{__('Here')}</MuiLink>
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider
                        color='dark'
                        sx={{
                            mt: 3,
                            ml: 'auto',
                            mr: 'auto',
                            borderColor: '#454545 !important'
                        }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 3
                        }}
                    >

                        {/* <Typography sx={{ color: 'white' }}>
                            ©{new Date().getFullYear()} Spacedev. All Rights Reserved. <br />
                            Powered by <MuiLink href="#" >SpaceDev</MuiLink>
                        </Typography> */}

                        <Typography sx={{ color: 'white' }} dangerouslySetInnerHTML={{
                            __html: __('©{{year}} Spacedev. All Rights Reserved. <br />Powered by {{link}}', {
                                year: new Date().getFullYear(),
                                link: ReactDOMServer.renderToStaticMarkup(<MuiLink href="#" >SpaceDev</MuiLink>)
                            })
                        }} />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <IconButton sx={{ color: 'white' }}>
                                <Icon icon="Facebook" />
                            </IconButton>
                            <IconButton sx={{ color: 'white' }}>
                                <Icon icon="LinkedIn" />
                            </IconButton>
                            <IconButton sx={{ color: 'white' }}>
                                <Icon icon="YouTube" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box >
            </Box >
            {renderMenuLanguage}
        </>
    )
}
