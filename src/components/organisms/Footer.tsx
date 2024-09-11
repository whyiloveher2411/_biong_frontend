import { Box, Button, IconButton, ListItemIcon, MenuItem, MenuList, Link as MuiLink, Typography, useTheme } from '@mui/material';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MenuPopover from 'components/atoms/MenuPopover';
import { LanguageProps, __ } from 'helpers/i18n';
import useResponsive from 'hook/useResponsive';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store/configureStore';
import { change as changeLanguage } from "store/language/language.reducers";
import { useLayoutHeaderFooter } from 'store/layout/layout.reducers';
import { upTimes, useSetting } from 'store/setting/settings.reducers';
import { refreshScreen } from 'store/user/user.reducers';

export default function Footer() {

    const anchorRef = React.useRef(null);

    const language = useSelector((state: RootState) => state.language);

    const settings = useSetting();

    const theme = useTheme();

    const dispatch = useDispatch();

    const [langObj, setLangObj] = React.useState<{
        open: boolean,
        languages: Array<LanguageProps>
    }>({
        open: false,
        languages: []
    });

    const layoutState = useLayoutHeaderFooter();

    const isPC = useResponsive('up', 'md');

    // const [openBackdrop, setOpenBackdrop] = React.useState(false);
    // const handleOpenBackdrop = () => setOpenBackdrop(true);
    // const handleCloseBackdrop = () => setOpenBackdrop(false);


    if (!layoutState.footerVisible) {
        return <></>
    }

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
            {/* {
                isPC ?
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'fixed',
                            zIndex: 1032,
                            left: 'auto',
                            padding: 0.5,
                            right: '8px',
                            top: 'calc(50% - 120px)',
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'dividerDark',
                            borderRadius: 1,
                        }}
                        id="share-box"
                    >
                        {
                            shareButtons.map((item, index) => (
                                <Tooltip
                                    key={index}
                                    title={item.name}
                                    placement="left"
                                    arrow
                                >
                                    <IconButton
                                        size='large'
                                        sx={{
                                            color: item.color
                                        }}
                                        onClick={() => {
                                            item.onClick();
                                        }}
                                    >
                                        <Icon icon={item.icon} />
                                    </IconButton>
                                </Tooltip>
                            ))
                        }
                    </Box>
                    :
                    <>
                        <Backdrop open={openBackdrop} sx={{ zIndex: 1032, top: '-200px', bottom: '-200px' }} />
                        <Box sx={{
                            height: 320, transform: 'translateZ(0px)', flexGrow: 1,
                            position: 'fixed',
                            bottom: 0,
                            right: 0,
                            zIndex: 1033,
                        }}>
                            <SpeedDial
                                ariaLabel="SpeedDial basic example"
                                sx={{ position: 'absolute', bottom: 16, right: 16, '& .MuiSpeedDialAction-staticTooltipLabel': { whiteSpace: 'nowrap', } }}
                                icon={<SpeedDialIcon />}
                                onOpen={handleOpenBackdrop}
                                onClose={handleCloseBackdrop}
                                open={openBackdrop}
                            >
                                {[...shareButtons, backToTop].reverse().map((action) => (
                                    <SpeedDialAction
                                        key={action.name}
                                        icon={<Icon sx={{ color: action.color }} icon={action.icon} />}
                                        tooltipTitle={action.name}
                                        tooltipOpen
                                        onClick={() => {
                                            action.onClick();
                                            handleCloseBackdrop();
                                        }}
                                    />
                                ))}
                            </SpeedDial>
                        </Box>
                    </>
            } */}
            <Box
                sx={{
                    pt: 1.25,
                    mt: 5,
                    background: theme.palette.footer?.background,
                    display: 'flex',
                    flexDirection: 'column',
                }}
                id="footer-main"
            >



                <Box
                    sx={{
                        width: 'var(--containerWidth)',
                        maxWidth: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        pl: 2,
                        pr: 2,
                        pt: 3,
                        pb: 3,
                        margin: '0 auto',
                    }}
                >

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: 'var(--containerWidth)',
                            maxWidth: '100%',
                        }}
                    >
                        <Typography sx={{ mr: '12px' }}>Theo dõi chúng tôi</Typography>
                        {
                            settings.contact?.social?.map((item, index) => (
                                <IconButton key={index} size="large" component={MuiLink} href={item.link} target='_blank' rel="nofollow">
                                    <Icon sx={{ color: item.color }} size="large" icon={item.icon} />
                                </IconButton>
                            ))
                        }
                    </Box>

                    <Divider color='dark' />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Box
                                component={Link}
                                to="/"
                                onClick={() => {
                                    dispatch(upTimes());
                                    window.scroll({
                                        top: 0,
                                        left: 0,
                                        behavior: 'smooth'
                                    })
                                }}
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    userSelect: 'none',
                                }}
                            >
                                <ImageLazyLoading
                                    src='/images/LOGO-image-full.svg'
                                    sx={{
                                        height: 28,
                                        width: 28,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontSize: 24,
                                        fontWeight: 500,
                                    }}
                                    variant="h2" noWrap>
                                    {'Spacedev.vn'}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    marginLeft: 3,
                                }}
                            >
                                <Button
                                    component={Link}
                                    color="inherit"
                                    sx={{
                                        textTransform: 'inherit',
                                        fontWeight: 400,
                                        fontSize: '1rem',
                                    }}
                                    disableRipple
                                    to="/about"
                                >
                                    {__('Về chúng tôi')}
                                </Button>

                                <Button
                                    component={Link}
                                    color="inherit"
                                    disableRipple
                                    to="/terms/terms-of-use"
                                    sx={{
                                        textTransform: 'inherit',
                                        fontWeight: 400,
                                        fontSize: '1rem',
                                    }}
                                >
                                    {__('Điều khoản & Điều kiện')}
                                </Button>
                                <Button
                                    component={Link}
                                    color="inherit"
                                    sx={{
                                        textTransform: 'inherit',
                                        fontWeight: 400,
                                        fontSize: '1rem',
                                    }}
                                    disableRipple
                                    to="/contact-us"
                                >
                                    {__('Liên hệ')}
                                </Button>
                                <a target='_blank' href='https://www.dmca.com/Protection/Status.aspx?id=15b2fb9f-ea5a-4409-8637-33851a5c1b6b&refurl=https%3a%2f%2fspacedev.vn' title="DMCA.com Protection Status" className="dmca-badge"> <img style={{ height: 24, marginBottom: '-8px', }} src="https://images.dmca.com/Badges/dmca-badge-w100-5x1-06.png?ID=15b2fb9f-ea5a-4409-8637-33851a5c1b6b" alt="DMCA.com Protection Status" /></a>
                            </Box>
                        </Box>
                        {
                            isPC &&
                            <Box>
                                <Button sx={{ textTransform: 'unset', fontWeight: 400, fontSize: 16 }} color='inherit' endIcon={<Icon icon={backToTop.icon} />} onClick={backToTop.onClick} >{backToTop.name}</Button>
                            </Box>
                        }
                    </Box >
                </Box>
            </Box >
            {renderMenuLanguage}
        </>
    )
}


export const shareButtons = [
    {
        icon: "EmailOutlined", name: __('Gửi qua email'), color: '#cd2d33',
        onClick: (url?: string) => {
            let link = "mailto:?subject=" + document.title
                + "&body=" + (url ? url : window.location.href);

            window.location.href = link;

            return false
        }
    },
    {
        icon: "InsertLinkOutlined", name: __('Sao chép liên kết'), color: 'primary.main',
        onClick: (url?: string) => {
            let item = url ? url : window.location.href;
            navigator.clipboard.writeText(item);
            window.showMessage(__('Đã sao chép liên kết vào bộ nhớ tạm.'), 'info');
        }
    },
    {
        icon: "Facebook", name: __('Chia sẻ lên Facebook'), color: '#4267B2',
        onClick: (url?: string) => {
            return !window.open('https://www.facebook.com/sharer/sharer.php?app_id=821508425507125&sdk=joey&u=' + (url ? url : window.location.href) + '&display=popup&ref=plugin&src=share_button', 'Facebook', 'width=640, height=580, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, top=' + (window.screen.height / 2 - 290) + ', left=' + (window.screen.width / 2 - 320));
        }
    },
    {
        icon: "Twitter", name: __('Chia sẻ lên Twitter'), color: '#1DA1F2',
        onClick: (url?: string) => {
            return !window.open(
                'https://twitter.com/intent/tweet?url=' + (url ? url : window.location.href) + '  &text=' + document.title, 'Twitter', 'width=640, height=580, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, top=' + (window.screen.height / 2 - 290) + ', left=' + (window.screen.width / 2 - 320))
        }
    },
    {
        icon: "LinkedIn", name: __('Chia sẻ lên LinkedIn'), color: '#2867B2',
        onClick: (url?: string) => {
            return !window.open(
                'https://www.linkedin.com/shareArticle/?url=' + (url ? url : window.location.href) + '&mini=true&text=' + document.title, 'Twitter', 'width=640, height=580, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, top=' + (window.screen.height / 2 - 290) + ', left=' + (window.screen.width / 2 - 320))
        }
    }
];

const backToTop = {
    icon: "ArrowUpwardRounded", name: __('Lên đầu trang'), color: '#095178',
    onClick: () => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }
};