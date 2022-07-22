import { Box, Card, CardContent, IconButton, Link, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon';
import { dateDiff, dateFormat } from 'helpers/date';
import { __ } from 'helpers/i18n'
import React from 'react'
import { UserCV } from 'services/elearningService/@type';
import EditEducation from './edit/EditEducation';

function Education({ cv, onReloadCV, editAble }: { cv: UserCV | null, editAble: boolean, onReloadCV: () => Promise<void> }) {

    const [isOpenEdit, setIsOpenEdit] = React.useState(false);

    if (isOpenEdit && editAble) {
        return <EditEducation cv={cv} onBack={() => setIsOpenEdit(false)} onReloadCV={onReloadCV} />
    }

    return (
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
                <Typography variant='overline' sx={{ fontSize: 15 }} color="text.secondary">{__('Education')}</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    {
                        cv?.education?.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    gap: 4,
                                }}
                            >

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        width: 170
                                    }}
                                >
                                    <Typography noWrap variant='h5'>{dateFormat(item.start_date, 'MMM YYYY')} - {item.end_date ? dateFormat(item.end_date, 'MMM YYYY') : __('Present')}</Typography>
                                    <Typography variant='overline'>
                                        {dateDiff(item.start_date, item.end_date)}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                    }}
                                >
                                    <Typography variant='h5'>{item.school}</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{item.field_of_study}</Typography>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
                <Typography variant='overline' sx={{ fontSize: 15 }} color="text.secondary">{__('Certifications')}</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    {
                        cv?.certifications?.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    gap: 4,
                                }}
                            >
                                <Typography sx={{ width: 170 }} variant='h5'>{dateFormat(item.time, 'MMM YYYY')}</Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                    }}
                                >
                                    <Typography variant='h5'>{item.certificate}</Typography>
                                    <Typography><Link href={item.website} target={'_blank'}>{item.website}</Link></Typography>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </CardContent>
        </Card>
    )
}

export default Education