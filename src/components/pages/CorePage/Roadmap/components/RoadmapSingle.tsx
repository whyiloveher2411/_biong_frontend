import { Skeleton } from '@mui/material'
import Box from 'components/atoms/Box'
import Icon from 'components/atoms/Icon'
import Typography from 'components/atoms/Typography'
import { cssMaxLine } from 'helpers/dom'
import { Link } from 'react-router-dom'
import { Roadmap } from 'services/elearningService'

function RoadmapSingle({ roadmap, linkTo, onClick }: { roadmap?: Roadmap, linkTo?: string, onClick?: () => void }) {

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
            }}>{roadmap.description}</Typography>
            <Icon sx={{
                position: 'absolute',
                right: 10,
                top: 10,
                color: 'success.main',
                opacity: roadmap.is_save === 'save' ? 1 : 0,
            }} icon="CheckCircleRounded" />
        </Box>;

        if (onClick) {
            return component;
        }

        return (
            <Link
                to={linkTo ? linkTo : "/roadmap/" + roadmap.slug}
            >
                {component}
            </Link>
        )
    }

    return (
        <Skeleton variant='rectangular' sx={{ height: 128, borderRadius: 2, }} />
    )

}

export default RoadmapSingle