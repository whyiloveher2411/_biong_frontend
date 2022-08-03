import { Rating, Theme } from "@mui/material";
import Box from "components/atoms/Box";
import ClickAwayListener from "components/atoms/ClickAwayListener";
import Icon from "components/atoms/Icon";
import ImageLazyLoading from "components/atoms/ImageLazyLoading";
import Input from "components/atoms/Input";
import List from "components/atoms/List";
import ListItem from "components/atoms/ListItem";
import ListItemIcon from "components/atoms/ListItemIcon";
import ListItemText from "components/atoms/ListItemText";
import makeCSS from "components/atoms/makeCSS";
import Paper from "components/atoms/Paper";
import Popper from "components/atoms/Popper";
import { PaginationProps } from "components/atoms/TablePagination";
import Typography from "components/atoms/Typography";
import { __ } from "helpers/i18n";
import { getImageUrl } from "helpers/image";
import { nFormatter } from "helpers/number";
import useAjax from "hook/useApi";
import React from "react";
import { Link } from "react-router-dom";
import { CourseProps } from "services/courseService";

export default function Search() {

    const classes = useStyles();

    const searchRef = React.useRef<HTMLDivElement>(null);

    const [searchValue, setSearchValue] = React.useState('');

    const handleSearchChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const [openSearchPopover, setOpenSearchPopover] = React.useState(false);

    const arrowRef = React.useRef(null);

    const useAjax1 = useAjax({ loadingType: 'custom' });

    const [popularSearches, setPopularSearches] = React.useState<PaginationProps<CourseProps> | null>(null);

    const handleSearchkeypress = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === 'Enter') {
            useAjax1.ajax({
                url: "vn4-e-learning/search/course",
                method: "POST",
                data: {
                    search: searchValue,
                },
                success: (result: {
                    products?: PaginationProps<CourseProps>
                }) => {
                    if (result.products && result.products.total) {
                        setOpenSearchPopover(true);
                        setPopularSearches(result.products);
                    } else {
                        setOpenSearchPopover(true);
                        setPopularSearches(null);
                    }
                },
            });
        }

    };

    const handleSearchPopverClose = () => {
        setOpenSearchPopover(false);
    };

    return (
        <div className={classes.searchWrapper}>

            <Box sx={{ display: 'flex', gap: 2 }} className={classes.search} ref={searchRef}>
                <Icon icon="Search" />
                <Input
                    className={classes.searchInput}
                    disableUnderline
                    onKeyPress={handleSearchkeypress}
                    onChange={handleSearchChange}
                    placeholder={__('Enter something...')}
                    value={searchValue}
                />
            </Box>

            <Popper
                anchorEl={searchRef.current}
                className={classes.searchPopper}
                open={openSearchPopover}
                modifiers={[
                    {
                        name: 'arrow',
                        enabled: true,
                        options: {
                            element: arrowRef.current,
                        },
                    },
                ]}
            >
                <div className={classes.MuiPopperArrow} ref={arrowRef}></div>
                <ClickAwayListener onClickAway={handleSearchPopverClose}>
                    <Paper className={classes.searchPopperContent + ' custom_scroll'} elevation={3}>
                        <List>
                            {
                                popularSearches !== null && popularSearches?.total > 0 ?
                                    popularSearches?.data?.map((search, index) => (
                                        <Link key={index} to={'/course/' + search.slug}>
                                            <ListItem
                                                button
                                                onClick={handleSearchPopverClose}
                                            >
                                                <ListItemIcon className={classes.iconSearchResult}>
                                                    <ImageLazyLoading
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: '4px',
                                                            mr: 0.5,
                                                        }}
                                                        src={getImageUrl(search.featured_image)}
                                                        name={search.title}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText disableTypography={true}>
                                                    <Typography>{search.title}</Typography>
                                                    {
                                                        Boolean(
                                                            search.course_detail?.sumary?.rating
                                                            && search.course_detail?.sumary?.reviewNumber
                                                        ) &&
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                gap: 1,
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Rating size="small" name="read-only" precision={0.1} value={parseFloat(search.course_detail?.sumary?.rating + '')} readOnly />
                                                            <Typography>
                                                                ({nFormatter(search.course_detail?.sumary?.reviewNumber ?? 0)})
                                                            </Typography>
                                                        </Box>
                                                    }
                                                </ListItemText>
                                            </ListItem>
                                        </Link>
                                    ))
                                    :
                                    <ListItem>
                                        <ListItemText disableTypography={true}>
                                            <Typography textAlign="center">{__('Data not found.')}</Typography>
                                        </ListItemText>
                                    </ListItem>
                            }
                        </List>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    );
}


const useStyles = makeCSS(({ spacing, palette, zIndex }: Theme) => ({
    MuiPopperArrow: {
        top: 0,
        marginTop: '1px',
        width: '3em',
        height: '1em',
        fontSize: '7px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        '&:before': {
            content: '""',
            margin: 'auto',
            display: 'block',
            width: '0px',
            height: '0px',
            borderStyle: 'solid',
            borderWidth: '0px 1em 1em',
            borderColor: 'transparent transparent ' + palette.background.paper,
        }
    },
    searchWrapper: {
        marginLeft: spacing(2),
        maxWidth: '100%',
        width: 300,
    },
    search: {
        backgroundColor: "rgba(255,255,255, 0.1)",
        borderRadius: 4,
        flexBasis: 300,
        padding: spacing(0, 2),
        display: "flex",
        alignItems: "center",
    },
    searchInput: {
        flexGrow: 1,
        color: "inherit",
        fontSize: 14,
        height: 36,
        "& input::placeholder": {
            opacity: .6,
            color: "inherit",
        },
    },
    iconSearchResult: {
        minWidth: 32,
    },
    searchPopper: {
        zIndex: zIndex.appBar + 100,
    },
    searchPopperContent: {
        marginTop: spacing(1),
        maxHeight: '80vh',
        overflow: 'auto',
        minWidth: 300,
        maxWidth: '100%',
        '& a': {
            color: 'inherit'
        }
    },
}));