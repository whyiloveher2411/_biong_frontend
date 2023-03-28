import { Card, CardContent, IconButton, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import React from 'react';
import { UserCV } from 'services/elearningService/@type';
import EditAbout from './edit/EditAbout';
import CodeBlock from 'components/atoms/CodeBlock';

function About({ cv, onReloadCV, editAble }: { cv: UserCV | null, editAble: boolean, onReloadCV: () => Promise<void> }) {

    const [isOpenEdit, setIsOpenEdit] = React.useState(false);

    if (isOpenEdit && editAble) {
        return <EditAbout cv={cv} onBack={() => setIsOpenEdit(false)} onReloadCV={onReloadCV} />
    }

    return (
        <>
            <Card>
                <CardContent
                    sx={{
                        display: 'flex',
                        gap: 3,
                        flexDirection: 'column',
                        position: 'relative'
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
                    <Typography variant='overline' sx={{ fontSize: 15 }} color="text.secondary">{__('About')}</Typography>
                    <CodeBlock html={cv?.about ?? __('(Thông tin chưa được cập nhật)')} />
                </CardContent>
            </Card >
        </>
    )
}

export default About