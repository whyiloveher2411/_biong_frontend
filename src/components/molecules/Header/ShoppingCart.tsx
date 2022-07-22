import { ListItemAvatar, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Avatar from "components/atoms/Avatar";
import Badge from "components/atoms/Badge";
import Box from "components/atoms/Box";
import Button from "components/atoms/Button";
import Divider from "components/atoms/Divider";
import Icon from "components/atoms/Icon";
import IconButton from "components/atoms/IconButton";
import List from "components/atoms/List";
import ListItem from "components/atoms/ListItem";
import ListItemButton from "components/atoms/ListItemButton";
import ListItemText from "components/atoms/ListItemText";
import MenuPopper from "components/atoms/MenuPopper";
import Skeleton from "components/atoms/Skeleton";
import Tooltip from "components/atoms/Tooltip";
import Typography from "components/atoms/Typography";
import { __ } from "helpers/i18n";
import { getImageUrl } from "helpers/image";
import { moneyFormat } from "plugins/Vn4Ecommerce/helpers/Money";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CourseProps } from "services/courseService";
import useShoppingCart from "store/shoppingCart/useShoppingCart";


const useStyles = makeStyles(({ zIndex, spacing, palette }: Theme) => ({
    searchPopper: {
        zIndex: zIndex.appBar + 100,
    },
    searchPopperContent: {
        maxHeight: '80vh',
        overflow: 'auto',
        minWidth: 300,
        maxWidth: '100%',
    },
    notification: {
        // borderBottom: '1px solid ' + palette.dividerDark,
    },
    notificationIcon: {
        backgroundColor: palette.primary.main,
        marginTop: 4
    },
    notificationTitle: {
        overflow: 'hidden', width: '100%', display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical'
    },
    notificationContent: {
        marginTop: 4, overflow: 'hidden', width: '100%', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical',
    },
}));

export default function ShoppingCart() {

    const classes = useStyles();

    const shoppingCart = useShoppingCart();

    const notificationRef = useRef(null);

    const [openNotifications, setOpenNotifications] = useState(false);

    const [courses, setCourses] = React.useState<Array<CourseProps> | null>(null);

    const onClickShowNotification = () => {
        if (!openNotifications) {
            setOpenNotifications(true);

            setCourses(null);

            shoppingCart.loadCartSummary((coursesApi: { [key: string]: Array<CourseProps> }) => {
                setCourses(coursesApi.products ?? []);
            });
        }
    };

    return (
        <>
            <Tooltip title={__("Cart")}>
                <IconButton
                    color="inherit"
                    onClick={onClickShowNotification}
                    ref={notificationRef}
                    size="large"
                >
                    <Badge badgeContent={shoppingCart.data.groups?.products?.length ?? 0} max={10} color="secondary">
                        <Icon icon="ShoppingCartOutlined" />
                    </Badge>
                </IconButton>
            </Tooltip>
            <MenuPopper
                anchorEl={notificationRef.current}
                className={classes.searchPopper}
                open={openNotifications}
                onClose={() => setOpenNotifications(false)}
                paperProps={{
                    style: { width: 320, maxWidth: '100%' },
                    className: classes.searchPopperContent + ' custom_scroll'
                }}
                disableTransition
            >
                <List>
                    {
                        courses === null ?
                            [1, 2, 3, 4].map(item => (
                                <ListItem
                                    onClick={() => setOpenNotifications(false)}
                                    className={classes.notification}
                                    key={item}
                                >
                                    <div style={{ width: '100%' }}>
                                        <Skeleton variant="text" height={20} width="100%" />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: "flex-start",
                                                width: '100%',
                                                gridGap: 16
                                            }}
                                        >
                                            <div style={{ height: '100%' }}>
                                                <Skeleton variant="circular" width={40} style={{ marginTop: 8 }} height={40} />
                                            </div>
                                            <div style={{ width: '100%' }}>
                                                <Skeleton variant="text" height={22} width="100%" />
                                                <Skeleton variant="text" style={{ transform: 'scale(1)' }} height={40} width="100%" />
                                            </div>
                                        </Box>
                                    </div>
                                </ListItem>
                            ))
                            :
                            courses.length > 0 ?
                                <>
                                    {
                                        courses.map((item) => (
                                            <ListItemButton
                                                key={item.id}
                                                className={classes.notification}
                                                component={Link}
                                                to={'/course/' + item.slug}
                                                onClick={() => setOpenNotifications(false)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        variant="square"
                                                        sx={{ width: 64, height: 64, mr: 1 }}
                                                        src={getImageUrl(item.featured_image)}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.title}
                                                    secondary={
                                                        <>
                                                            {
                                                                item.course_detail?.owner_detail &&
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        mt: 0.5,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    {__('By')} {item.course_detail?.owner_detail.title}
                                                                </Typography>
                                                            }

                                                            <Typography className={classes.notificationContent} variant="h6" component="span" >{moneyFormat(item.price)}</Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItemButton>
                                        ))
                                    }
                                    <Divider color="dark" sx={{ borderStyle: 'dashed' }} />
                                    <Box sx={{ p: 2, pb: 1, gap: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h4">
                                            {__('Total: {{money}}', {
                                                money: moneyFormat(courses.reduce((total, item) => total + parseFloat(item.price), 0))
                                            })}
                                        </Typography>
                                        <Button
                                            component={Link}
                                            variant="contained"
                                            to="/cart"
                                            fullWidth
                                            disableRipple
                                            onClick={() => setOpenNotifications(false)}
                                        >
                                            {__('Go to Cart')}
                                        </Button>
                                    </Box>
                                </>
                                :
                                <Link to={'/cart'}>
                                    <ListItem
                                        button
                                        onClick={() => setOpenNotifications(false)}
                                        className={classes.notification}
                                    >
                                        <Typography style={{ width: '100%', padding: '46px 0', fontSize: 20, fontWeight: 100 }} align="center" variant="body1">{__('Your cart is empty')}</Typography>
                                    </ListItem>
                                </Link>
                    }
                </List>
            </MenuPopper>
        </>
    );
}
