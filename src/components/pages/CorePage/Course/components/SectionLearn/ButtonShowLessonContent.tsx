import { Box, Button, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import { __ } from 'helpers/i18n'
import React from 'react'
import CourseLearningContext, { CourseLearningContextProps } from '../../context/CourseLearningContext'
import { useUser } from 'store/user/user.reducers'

function ButtonShowLessonContent() {

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    const user = useUser();

    if (!courseLearningContext.LessonList.open) {
        return (<Box
            sx={{
                position: 'fixed',
                bottom: 0,
                zIndex: 1032,
                transition: 'all 300ms',
                ...(user.getThemeLearning() === 'main_right' ? {
                    right: '100%',
                    transform: 'translateX(3rem)',
                } : {
                    left: '100%',
                    transform: 'translateX(-3rem)',
                }),
                '&:hover': {
                    ...(user.getThemeLearning() === 'main_right' ? {
                        transform: 'translateX(100%)',
                    } : {
                        left: '100%',
                        transform: 'translateX(-100%)',
                    }),
                },
                '& .show-course-content': {
                    transition: 'all 1000ms',
                    opacity: 0,
                },
                '&:hover .show-course-content': {
                    transition: 'all 1000ms',
                    opacity: 1,
                },
            }}
        >
            <Button
                onClick={courseLearningContext.LessonList.onToggle}
                variant="outlined"
                size='large'
                endIcon={user.getThemeLearning() === 'main_right' ? <Icon icon="ArrowForwardRounded" /> : undefined}
                startIcon={user.getThemeLearning() === 'main_left' ? <Icon icon="ArrowBackRounded" /> : undefined}
                sx={(theme) => ({
                    ...(theme.palette.mode === 'light' ? {
                        ['--color' as string]: 'white',
                        color: 'white',
                        backgroundColor: '#333232 !important',
                    } : {
                        ['--color' as string]: '#333232',
                        color: '#333232',
                        backgroundColor: 'white !important',
                    }),
                })}
            >
                <Typography sx={{
                    color: 'var(--color)', textTransform: 'none',
                    fontSize: '18px',
                }} className='show-course-content'>
                    {__('Nội dung khóa học')}
                </Typography>
            </Button>
        </Box>)
    }

    return null;
}

export default ButtonShowLessonContent