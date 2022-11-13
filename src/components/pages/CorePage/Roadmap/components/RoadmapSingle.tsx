import Box from 'components/atoms/Box'
import Icon from 'components/atoms/Icon'
import Typography from 'components/atoms/Typography'
import React from 'react'
import { Link } from 'react-router-dom'
import { Roadmap } from 'services/elearningService'

function RoadmapSingle({ roadmap }: { roadmap: Roadmap }) {
    return (
        <Link
            to={"/roadmap/" + roadmap.slug}
        >
            <Box
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
                        transform: 'scale(1.02) translateZ(0)',
                    }
                })}
            >
                <Typography sx={(theme) => ({ color: theme.palette.mode === 'light' ? 'white' : roadmap.color, mb: 1, })} variant="h4">{roadmap.title}</Typography>
                <Typography sx={{ color: 'white', opacity: 0.7, fontSize: 14 }}>{roadmap.description}</Typography>
                <Icon sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    color: 'success.main',
                    opacity: roadmap.is_save === 'save' ? 1 : 0,
                }} icon="CheckCircleRounded" />
            </Box>
        </Link>
    )
}

export default RoadmapSingle