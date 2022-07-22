import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n'
import React from 'react';
import { UserCV } from 'services/elearningService/@type';
import EditReferences from './edit/EditReferences';

function References({ cv, onReloadCV, editAble }: { cv: UserCV | null, editAble: boolean, onReloadCV: () => Promise<void> }) {

    const [isOpenEdit, setIsOpenEdit] = React.useState(false);

    if (isOpenEdit && editAble) {
        return <EditReferences cv={cv} onBack={() => setIsOpenEdit(false)} onReloadCV={onReloadCV} />
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
                <Typography variant='overline' sx={{ fontSize: 15 }} color="text.secondary">{__('References')}</Typography>
                {
                    cv?.references?.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                            }}
                        >
                            <Typography>{item.full_name}</Typography>
                            <Typography>{item.role} - {item.company_name}</Typography>
                            <Typography>Email: {item.email}</Typography>
                        </Box>
                    ))
                }
            </CardContent>
        </Card>
    )
}

export default References