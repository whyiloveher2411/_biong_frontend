import { Box, Card, CardContent, IconButton, Link, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import makeCSS from 'components/atoms/makeCSS';
import { dateFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import moment from 'moment';
import React from 'react';
import { UserCV } from 'services/elearningService/@type';
import { UserProps } from 'store/user/user.reducers';
import EditPersonalInfo from './edit/EditPersonalInfo';

const useStyle = makeCSS({
    btnLink: {
        '&:hover .MuiSvgIcon-root': {
            color: 'var(--color)',
        }
    }
});

function PersonalInfo({ user, cv, onReloadCV, editAble }: { user: UserProps, cv: UserCV | null, editAble: boolean, onReloadCV: () => Promise<void> }) {

    const classes = useStyle();

    const [isOpenEdit, setIsOpenEdit] = React.useState(false);

    if (isOpenEdit && editAble) {
        return <EditPersonalInfo cv={cv} onBack={() => setIsOpenEdit(false)} onReloadCV={onReloadCV} />
    }

    return (
        <Card>
            <CardContent
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                {
                    editAble &&
                    <>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                            onClick={() => {
                                setIsOpenEdit(true);
                            }}
                        >
                            <Icon icon="EditOutlined" />
                        </IconButton>
                    </>
                }

                <Typography variant='overline' sx={{ fontSize: 15 }} color="text.secondary">{__('Personal Info')}</Typography>
                {
                    (() => {

                        const views = [];

                        cv?.personal_info.birthday && moment(cv?.personal_info.birthday).isValid() &&
                            views.push(<Box key="birthday">
                                <Typography variant='overline' color={'text.secondary'}>{__('Birthday')}</Typography>
                                <Typography>{dateFormat(cv?.personal_info.birthday ?? '')}</Typography>
                            </Box>)

                        Boolean(cv?.personal_info.address) &&
                            views.push(<Box key="address">
                                <Typography variant='overline' color={'text.secondary'}>{__('Address')}</Typography>
                                <Typography>{cv?.personal_info.address}</Typography>
                            </Box>)

                        Boolean(cv?.personal_info.phone_number) &&
                            views.push(<Box key="phone_number">
                                <Typography variant='overline' color={'text.secondary'}>{__('Phone')}</Typography>
                                <Typography>{cv?.personal_info.phone_number}</Typography>
                            </Box>)

                        Boolean(user.email) &&
                            views.push(<Box key="email">
                                <Typography variant='overline' color={'text.secondary'}>{__('Email')}</Typography>
                                <Typography>{user.email}</Typography>
                            </Box>)

                        Boolean(cv?.personal_info.languages) &&
                            views.push(<Box key="languages">
                                <Typography variant='overline' color={'text.secondary'}>{__('Language')}</Typography>
                                <Typography>{cv?.personal_info.languages}</Typography>
                            </Box>)

                        Boolean(cv?.personal_info.social.length) &&
                            views.push(<Box key="length">
                                <Typography variant='overline' color={'text.secondary'}>{__('Connect me')}</Typography>
                                <Box>
                                    {
                                        cv?.personal_info.social.map((item, index) => (
                                            socialType[item.type] ?
                                                <IconButton key={index} size='small' className={classes.btnLink} component={Link} href={item.link} target={'_blank'} rel="nofollow">
                                                    <Icon icon={socialType[item.type].icon} style={{ ['--color']: socialType[item.type].color }} />
                                                </IconButton>
                                                :
                                                <React.Fragment key={index} />
                                        ))
                                    }
                                </Box>
                            </Box>)

                        if (views.length) {
                            return views;
                        }

                        return <Typography>{__('(Thông tin chưa được cập nhật)')}</Typography>
                    })()
                }
            </CardContent>
        </Card>
    )
}

const socialType: {
    [key: string]: {
        icon: string,
        color: string,
    }
} = {
    facebook: {
        icon: 'FacebookRounded',
        color: '#4267B2',
    },
    twitter: {
        icon: 'Twitter',
        color: '#1DA1F2',
    },
    youTube: {
        icon: 'YouTube',
        color: '#FF0000',
    },
    linkedIn: {
        icon: 'LinkedIn',
        color: '#2867B2',
    },
    hithub: {
        icon: 'GitHub',
        color: '#4078c0',
    },
};

export default PersonalInfo