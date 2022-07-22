import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { dateDiff, dateFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import React from 'react';
import { UserCV } from 'services/elearningService/@type';
import EditExperience from './edit/EditExperience';

function WorkExperience({ cv, onReloadCV, editAble }: { cv: UserCV | null, editAble: boolean, onReloadCV: () => Promise<void> }) {

    // const [workExperience,] = React.useState<Array<{
    //     time: string,
    //     title: string,
    //     position: string,
    //     description: string,
    // }>>([
    //     {
    //         time: '2021 - Present',
    //         title: 'Faro-pay',
    //         position: 'Web Application Developer',
    //         description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae beatae atque itaque voluptatum quaerat delectus numquam nulla officiis. Voluptate provident dicta non porro consectetur perferendis? Iusto rerum placeat vel quia!',
    //     },
    //     {
    //         time: '2015 - 2021',
    //         title: 'DNA Digital',
    //         position: 'Developer',
    //         description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae beatae atque itaque voluptatum quaerat delectus numquam nulla officiis. Voluptate provident dicta non porro consectetur perferendis? Iusto rerum placeat vel quia!',
    //     },
    //     {
    //         time: '2012 - 2015',
    //         title: 'Freelancer',
    //         position: 'Freelancer',
    //         description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae beatae atque itaque voluptatum quaerat delectus numquam nulla officiis. Voluptate provident dicta non porro consectetur perferendis? Iusto rerum placeat vel quia!',
    //     }
    // ]);

    const [isOpenEdit, setIsOpenEdit] = React.useState(false);

    if (isOpenEdit && editAble) {
        return <EditExperience cv={cv} onBack={() => setIsOpenEdit(false)} onReloadCV={onReloadCV} />
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
                <Typography variant='overline' sx={{ fontSize: 15 }} color="text.secondary">{__('Work Experience')}</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    {
                        cv?.work_experience?.map((item, index) => (
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
                                        gap: 1,
                                        flex: 1,
                                    }}
                                >
                                    <Typography variant='h5'>{item.company_name}</Typography>
                                    <Typography variant='overline'>{item.title} - {listOptionEmploymentType[item.employment_type] ? listOptionEmploymentType[item.employment_type].title : '[Unknown]'}</Typography>
                                    <Typography>{item.description}</Typography>
                                    <Typography variant="body2">{item.location}</Typography>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </CardContent>
        </Card>
    )
}

const listOptionEmploymentType: {
    [key: string]: {
        title: string
    }
} = {
    full_time: { title: __('Full Time') },
    part_time: { title: __('Part Time') },
    self_employed: { title: __('Self-employed') },
    freelance: { title: __('Freelance') },
    contract: { title: __('Contract') },
    internship: { title: __('Internship') },
    apprenticeship: { title: __('Apprenticeship') },
    seasonal: { title: __('Seasonal') },
}

export default WorkExperience