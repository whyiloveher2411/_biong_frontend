import { Skeleton } from '@mui/material'
import Box from 'components/atoms/Box'
import Icon from 'components/atoms/Icon'
import Typography from 'components/atoms/Typography'
import DrawerCustom from 'components/molecules/DrawerCustom'
import { cssMaxLine } from 'helpers/dom'
import { Link } from 'react-router-dom'
import { Roadmap } from 'services/elearningService'
import RoadmapDetail from './RoadmapDetail'
import React from 'react'
import { nFormatter } from 'helpers/number'
import { dateFormat } from 'helpers/date'

function RoadmapSingle({ roadmap, linkTo, onClick, inPopup }: {
    roadmap?: Roadmap,
    linkTo?: string,
    onClick?: () => void,
    inPopup?: boolean,
}) {

    const [open, setOpen] = React.useState(false);

    if (roadmap) {
        const component = <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                height: '100%',
                p: 3,
                borderRadius: 2,
                cursor: 'pointer',
                background: theme.palette.mode === 'light' ? roadmap.background : 'rgba(255,255,255,.05)',
                transition: 'all 150ms',
                '&:hover': {
                    // transform: 'scale(1.02) translateZ(0)',
                    opacity: 0.8,
                }
            })}
            onClick={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    onClick();
                }
            }}
        >
            <Typography sx={(theme) => ({ color: theme.palette.mode === 'light' ? 'white' : roadmap.color, mb: 1, })} variant="h4">{roadmap.title}</Typography>
            <Typography sx={{
                color: 'white',
                opacity: 0.7,
                fontSize: 14,
                ...cssMaxLine(2),
            }}>Cập nhật lần cuối {dateFormat(roadmap.updated_at)}</Typography>
            <Icon
                renderVersion={roadmap.my_reaction_type}
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    color: 'success.main',
                    opacity: roadmap.my_reaction_type === 'save' ? 1 : 0,
                }} icon="CheckCircleRounded" />

            {
                roadmap.count_save ?
                    <Typography variant='body2' sx={(theme) => ({ position: 'absolute', margin: '0 !important', fontSize: 13, opacity: 0.7, color: theme.palette.mode === 'light' ? 'white' : roadmap.color, right: 40, top: 13 })}>{nFormatter(roadmap.count_save + (Number(roadmap.count_save_fake) ? Number(roadmap.count_save_fake) : 0))} người đã lưu</Typography>
                    :
                    <></>
            }
        </Box>;

        if (onClick) {
            return component;
        }

        if (inPopup) {
            return (
                <>
                    <Box
                        sx={{
                            cursor: 'pointer',
                            height: '100%',
                        }}
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        {component}
                    </Box>
                    <DrawerCustom
                        open={open}
                        width="1090px"
                        onCloseOutsite
                        onClose={() => {
                            setOpen(false);
                        }}
                        title={'Roadmap ' + roadmap?.title}
                    >
                        <RoadmapDetail
                            disableActionBack
                            slug={roadmap.slug}
                        />
                    </DrawerCustom>
                </>
            )
        }

        return (<Link
            to={linkTo ? linkTo : "/roadmap/" + roadmap.slug}
        >
            {component}
        </Link>)
    }

    return (
        <Skeleton variant='rectangular' sx={{ height: 128, borderRadius: 2, }} />
    )

}

export default RoadmapSingle