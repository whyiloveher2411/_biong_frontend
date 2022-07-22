import { Card, CardActions, CardContent, IconButton, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import React from 'react';
import { UserCV } from 'services/elearningService/@type';
import EditSkill from './edit/EditSkill';

function Skills({ cv, onReloadCV, editAble }: { cv: UserCV | null, editAble: boolean, onReloadCV: () => Promise<void> }) {

    const [isOpenEdit, setIsOpenEdit] = React.useState(false);

    if (isOpenEdit && editAble) {
        return <EditSkill cv={cv} onBack={() => setIsOpenEdit(false)} onReloadCV={onReloadCV} />
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
                <Typography variant='overline' sx={{ fontSize: 15 }} color="text.secondary">{__('Skills')}</Typography>
                {
                    [0, 1, 2, 3].map((item, index) => (
                        cv?.skills?.[item] ?
                            <Typography key={index} variant='h5'>{cv.skills[item].title}</Typography>
                            :
                            <React.Fragment key={index} />
                    ))
                }
            </CardContent>
            <Divider color='dark' />
            {
                Boolean(cv?.skills && cv.skills.length > 4) &&
                <CardActions>
                    <Typography align='center' sx={{ width: '100%', fontSize: 16 }}>{__('Show all {{count}} skills', {
                        count: cv?.skills ? cv.skills.length : 0,
                    })}</Typography>
                </CardActions>
            }
        </Card>
    )
}

export default Skills