import Subtitles from '@mui/icons-material/Subtitles';
import Translate from '@mui/icons-material/Translate';
import { Box, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import 'assets/css/video-js.min.css';
import Label from 'components/atoms/Label';
import { convertHMS } from 'helpers/date';
import React from 'react';


const ContentTranscriptVideo = ({ transcript, index }: {
    transcript: Array<{
        start: string,
        duration: string,
        text: string,
        target: string,
    }>, index: number
}) => {

    const playerCurrent = React.useRef<ANY>(null);

    const transitElement = React.useRef<HTMLDivElement | null>(null);
    const parentTransitElement = React.useRef<HTMLDivElement | null>(null);

    return <Card
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <CardHeader
            title={<Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Typography>Nội dung</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                    }}
                >
                    <Tooltip title='Dịch văn bản'>
                        <IconButton
                        >
                            <Translate />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Hiển thị subtitle video'>
                        <IconButton
                        >
                            <Subtitles />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>}
            sx={{
                flexShrink: 0,
            }}
        />
        <CardContent
            sx={{
                flexGrow: 1,
                position: 'relative',
                pt: 0,
            }}
            className='custom_scroll custom'
            ref={parentTransitElement}
        >
            <Box
                sx={{
                    position: 'absolute',
                    right: 0,
                    left: 0,
                }}
            >
                {
                    transcript.map((subtitle, i) => (<Box
                        key={i}
                        ref={index === i ? transitElement : null}
                        sx={{
                            p: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            background: i === index ? 'rgba(62,121,247,.1)' : 'unset',
                            cursor: 'pointer',
                            '&:hover': {
                                background: 'rgba(62,121,247,.1)',
                            }
                        }}
                        onClick={() => {
                            if (playerCurrent.current) {
                                console.log(subtitle.start);
                                playerCurrent.current.currentTime(parseFloat(subtitle.start));
                                playerCurrent.current.play();
                            }
                        }}
                    >
                        <Label
                            sx={{
                                color: '#2a59d1 !important',
                                backgroundColor: 'rgba(62,121,247,.1) !important',
                                textShadow: 'unset !important',
                                fontWeight: 'bold !important',
                                fontSize: '14px !important',
                            }}
                        >{convertHMS(parseInt(subtitle.start)) ?? '00:00'}</Label>
                        <Box>
                            <Typography dangerouslySetInnerHTML={{ __html: subtitle.text }} />
                            <Typography sx={{ opacity: 0.7, fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: subtitle.target }} />
                        </Box>
                    </Box>))

                }
                {/* <audio controls id="tts-audio" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0, pointerEvents: 'none' }} /> */}
            </Box>
        </CardContent>
    </Card>
}

export default ContentTranscriptVideo