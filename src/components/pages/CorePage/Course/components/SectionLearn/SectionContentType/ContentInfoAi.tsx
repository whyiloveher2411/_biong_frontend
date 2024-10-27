import { Badge, Box, Button, Card, CardContent, CardHeader } from '@mui/material';
import 'assets/css/video-js.min.css';
import Label from 'components/atoms/Label';
import Typography from 'components/atoms/Typography';
import DrawerCustom from 'components/molecules/DrawerCustom';
import MindmapMarkdown from 'components/pages/CorePage/Resources/Mindmap/MindmapMarkdown';
import { convertHMS } from 'helpers/date';
import React from 'react';
import { ProcessLearning } from 'services/courseService';

function ContentInfoAi({ playerRef, process, indexTranscript, setIndexTranscript }: {
    playerRef: React.MutableRefObject<ANY>,
    indexTranscript: number,
    setIndexTranscript: React.Dispatch<React.SetStateAction<number>>,
    process: ProcessLearning | null
}) {

    const parentTransitElement = React.useRef<HTMLDivElement | null>(null);
    const transitElement = React.useRef<HTMLDivElement | null>(null);

    const [showMindmap, setShowMindmap] = React.useState(false);

    React.useEffect(() => {
        if (transitElement.current && parentTransitElement.current) {
            parentTransitElement.current?.scrollTo({
                top: transitElement.current?.offsetTop,
                behavior: 'smooth',
            });
        }
    }, [indexTranscript]);

    if (!process?.info_ai?.mindmap && !process?.info_ai?.subtitles_combined && !process?.info_ai?.summary) return null;

    return (<>
        <Box
            sx={{
                maxWidth: '480px',
                width: '30%',
                flexShrink: 0,
                height: '100%',
            }}
        >
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '.MuiCardHeader-root': {
                        backgroundColor: 'divider',
                    }
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
                        <Box>
                            <Badge badgeContent={'Mới'} color='error'>
                                <Button
                                    color='primary'
                                    variant='contained'
                                    onClick={() => {
                                        setShowMindmap(true);
                                        playerRef.current?.pause();
                                    }}
                                >
                                    Mindmap
                                </Button>
                            </Badge>
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
                    {
                        !process?.info_ai?.subtitles_combined?.length &&
                        <Typography sx={{ mt: 2, lineHeight: 1.5 }}>{process?.info_ai.summary}</Typography>
                    }
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 0,
                            left: 0,
                        }}
                    >
                        {
                            process?.info_ai?.subtitles_combined?.map((subtitle, i) => (<Box
                                key={i}
                                ref={indexTranscript === i ? transitElement : null}
                                sx={{
                                    p: 2,
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    background: i === indexTranscript ? 'rgba(62,121,247,.1)' : 'unset',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        background: 'rgba(62,121,247,.1)',
                                    }
                                }}
                                onClick={() => {
                                    setIndexTranscript(i);
                                    if (playerRef.current) {
                                        //     console.log(subtitle.start);
                                        playerRef.current.currentTime(parseFloat(subtitle.start) / 1000);
                                        playerRef.current.play();
                                    }
                                }}
                            >
                                {
                                    subtitle.type === 'header' ?
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '18', position: 'sticky', top: 2 }}>{subtitle.text}</Typography>
                                        :
                                        <>
                                            <Label
                                                sx={{
                                                    color: '#2a59d1 !important',
                                                    backgroundColor: 'rgba(62,121,247,.1) !important',
                                                    textShadow: 'unset !important',
                                                    fontWeight: 'bold !important',
                                                    fontSize: '14px !important',
                                                }}
                                            >{convertHMS(parseInt(subtitle.start) / 1000) ?? '00:00'}</Label>
                                            <Box>
                                                <Typography dangerouslySetInnerHTML={{ __html: subtitle.text }} />
                                                <Typography sx={{ opacity: 0.7, fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: subtitle.target }} />
                                            </Box>
                                        </>
                                }
                            </Box>))

                        }
                        {/* <audio controls id="tts-audio" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0, pointerEvents: 'none' }} /> */}
                    </Box>
                </CardContent>
            </Card>
        </Box>
        <DrawerCustom
            open={showMindmap}
            width={1900}
            onClose={() => {
                setShowMindmap(false);
            }}
            title='Mindmap'
            anchor='right'
        >
            <Typography sx={{ fontSize: 16, mb: 2, mt: 1, }}>{process?.info_ai?.summary}</Typography>
            <MindmapMarkdown height={'100vh'} md={process?.info_ai?.mindmap || ''} />
        </DrawerCustom>
    </>)
}

export default ContentInfoAi
