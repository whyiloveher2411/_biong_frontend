import { Box, Card, CardContent, CardHeader, Grid, Theme, Typography } from '@mui/material';
import 'assets/css/video-js.min.css';
import Label from 'components/atoms/Label';
import makeCSS from 'components/atoms/makeCSS';
import { convertHMS } from 'helpers/date';
import { addScript, delayUntil } from 'helpers/script';
import { UseBookmarks } from 'hook/useBookmarks';
import React from 'react';
import { Mindmap } from 'services/mindmapService';
import MoreButtonVideoMindmap from '../../components/MoreButtonVideoMindmap';

function VideoWithTranscript({ youtubeId, transcript, slug, bookmark, mindmap }: {
    youtubeId: string,
    slug: string,
    transcript: Array<{
        start: string,
        duration: string,
        text: string,
        target: string,
    }>,
    bookmark: UseBookmarks,
    mindmap: Mindmap | null
}) {

    const classes = useStyle();

    const [index, setIndex] = React.useState(-1);

    const playerCurrent = React.useRef<ANY>(null);

    const transitElement = React.useRef<HTMLDivElement | null>(null);
    const parentTransitElement = React.useRef<HTMLDivElement | null>(null);

    const [timeUpdate, setTimeUpdate] = React.useState(0);

    React.useEffect(() => {
        if (!youtubeId) return;
        window.__videoTimeCurrent = 0;
        // addStyleLink('https://vjs.zencdn.net/7.18.1/video-js.css', 'video-js-css', () => {
        //     //
        // });
        window.initYTPlayer = (player: ANY) => {
            window.__ytPlayer = player;
        };

        addScript('/js/video.min.js', 'video.js', () => {
            addScript('/js/videojs-youtube.min.js', 'videojs-youtube', function () {
                // addScript('https://unpkg.com/@videojs/http-streaming@2.14.0/dist/videojs-http-streaming.min.js', 'hls', () => {
                if (window.videojs) {

                    delayUntil(() => document.getElementById('player_video_youtube_' + slug) !== null, function () {
                        let player = window.videojs('player_video_youtube_' + slug, {
                            controls: true,
                            controlBar: {},
                            techOrder: ['youtube'],
                            enablePrivacyEnhancedMode: true,
                            sources: [
                                {
                                    src: "https://youtu.be/" + youtubeId,
                                    type: "video/youtube",
                                    youtube: {
                                        enablePrivacyEnhancedMode: true,
                                        controls: 0,
                                    }
                                }
                            ],
                        }, function () {
                            // alert(2);
                        });
                        playerCurrent.current = player;
                        player.on('timeupdate', function () {
                            const videoTimeCurrent = player.currentTime();
                            const index = transcript.findIndex((subtitle, i) => (parseFloat(subtitle.start) > videoTimeCurrent));
                            if (index > -1) {
                                setIndex(index - 1);
                            } else {
                                setIndex(transcript.length - 1);
                            }
                        });
                    });
                }
                // });
            }, 10, 10, function () {

                if (window.videojs) {

                    const techs: string[] = window.videojs.options.techOrder;

                    if (Array.isArray(techs)) {
                        return techs.indexOf('Youtube') > -1;
                    }
                }

                return false;

            });

        }, 10, 10, () => {
            if (window.videojs) return true;
            return false;
        });

        return () => {
            if (playerCurrent.current) {
                try {
                    playerCurrent.current.dispose();
                } catch (error) {
                    // 
                }
            }
        }
    }, [youtubeId]);

    // const playTTS = (text: string, lang: string) => {
    //     // Get the audio element
    //     const audioEl = document.getElementById('tts-audio') as HTMLMediaElement;

    //     const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${text}`;

    //     // add the sound to the audio element
    //     audioEl.src = url;

    //     //For auto playing the sound
    //     audioEl.play();
    // };

    React.useEffect(() => {
        // if (transitElement.current && parentTransitElement.current) {
        // transitElement.current.scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'nearest',
        // });

        // playTTS(sourceTranscript[index]?.text, 'en-US');
        // }
        if (transitElement.current && parentTransitElement.current) {
            parentTransitElement.current?.scrollTo({
                top: transitElement.current?.offsetTop,
                behavior: 'smooth',
            });
        }
    }, [index]);

    React.useEffect(() => {
        setTimeUpdate(prev => prev + 1);
    }, [slug]);

    const componentVideo = (
        <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={8}>
                <Box
                    sx={{
                        maxWidth: '100%',
                        aspectRatio: '16/9',
                        display: 'flex',
                        position: 'relative',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            textAlign: 'center',
                            width: '100%',
                            height: '100%',
                            background: 'rgb(0 0 0/1)',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                        className={classes.video}
                    >
                        <video
                            className={'video-js vjs-default-skin'}
                            id={'player_video_youtube_' + slug}
                            style={{
                                position: 'absolute',
                                height: '100%',
                                width: '100%',
                            }}
                            controls
                        >
                            Your browser does not support HTML video.
                        </video>

                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            background: 'black',
                            pt: 3,
                            pb: 3,
                        }}
                    >
                        <Typography align='center' sx={{ color: 'white', fontSize: 26, px: 3, mt: 1, lineHeight: 1.3 }} dangerouslySetInnerHTML={{ __html: transcript[index]?.text ? transcript[index]?.text : '&nbsp;' }} />
                        <Typography align='center' sx={{ color: 'primary.main', fontSize: 26, fontStyle: 'italic', mt: 1, px: 3, lineHeight: 1.3 }} dangerouslySetInnerHTML={{ __html: transcript[index]?.target ? transcript[index]?.target : '&nbsp;' }} />
                    </Box>
                    {/* <iframe style={{ border: 'none' }} width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> */}
                </Box>
            </Grid>
            <Grid item xs={12} md={4}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Card
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
                                {mindmap && <MoreButtonVideoMindmap mindmap={mindmap} bookmark={bookmark} />}
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
            </Grid>
        </Grid>
    )

    if (timeUpdate % 2 === 0) return componentVideo;

    return <Box>
        {componentVideo}
    </Box>;
}

export default VideoWithTranscript


const useStyle = makeCSS((theme: Theme) => ({
    video: {
        width: '100%',
        height: '100%',
        margin: '0 auto',
        overflow: 'hidden',
        '& .vjs-iframe-blocker': {
            display: 'none',
        },
        '& .vjs-poster': {
            display: 'none',
        },
        '& .video-js': {
            zIndex: 1030,
            maxWidth: 'unset',
            width: '100%',
            fontSize: 14,
            '&.vjs-hls-quality-selector': {
                display: 'block'
            },
            '& .vjs-control': {
                outline: 'none',
            },
            '& .vjs-picture-in-picture-control': {
                display: 'none',
            },
            '& #chapter_video': {
                width: 'auto',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                '& .vjs-icon-placeholder': {
                    whiteSpace: 'nowrap',
                    fontFamily: '"main","Helvetica","Arial",sans-serif',
                }
            },
            '& .MuiSvgIcon-root': {
                width: '26px',
                height: '26px',
                fill: 'white',
            },
            '& .vjs-menu': {
                zIndex: 1013,
            },
            '& .vjs-time-divider': {
                zIndex: 9,
                lineHeight: '38px',
            },
            '& .vjs-control-bar': {
                display: 'none',
            },
            '&.vjs-paused .vjs-control-bar,&.vjs-ended .vjs-control-bar, &:hover .vjs-control-bar': {
                opacity: 1,
            },
            // '&.vjs-paused .vjs-big-play-button': {
            //     display: 'block'
            // },
            '& .switch': {
                position: 'relative',
                display: 'inline-block',
                width: '32px',
                height: '14px',
            },
            '& .switch input': {
                opacity: 0,
                width: 0,
                height: 0,
            },
            '& .slider': {
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#ccc',
                transition: '.4s',
            },
            '& .slider:before': {
                position: 'absolute',
                content: '""',
                height: '10px',
                width: '10px',
                left: '2px',
                bottom: '2px',
                backgroundColor: 'white',
                transition: '.4s',
            },
            '& input:checked + .slider': {
                backgroundColor: theme.palette.primary.main,
            },
            '& input:focus + .slider': {
                boxShadow: '0 0 1px ' + theme.palette.primary.main,
            },
            '& input:checked + .slider:before': {
                transform: 'translateX(18px)',
            },
            '& .slider.round': {
                borderRadius: '34px',
            },
            '& .slider.round:before': {
                borderRadius: '50%',
            },
        },
        '& .vjs-menu': {
            zIndex: 99,
        },
        '& .video-js .vjs-remaining-time': {
            display: 'none',
        },
        '& .video-js .vjs-current-time, & .video-js .vjs-time-divider, & .video-js .vjs-duration': {
            display: 'block',
        },
        '& .video-js .vjs-time-divider': {
            lineHeight: '28px',
            padding: 0,
        },
        '& .video-js .vjs-current-time': {
            paddingRight: 0,
        },
        '& .video-js .vjs-duration': {
            paddingLeft: 0,
        },
        '& .vjs-volume-control': {
            zIndex: 1022,
        },
        '& .vjs-icon-placeholder': {
            fontFamily: 'VideoJS',
        },
        '& .vjs-icon-replay-10:before': {
            content: '"\f11d"',
            display: 'inline-block',
            width: '100%',
        },
        '& .video-js .vjs-progress-control': {
            position: 'initial',
            pointerEvents: 'none',
        },
        '& .video-js .vjs-progress-control .vjs-progress-holder': {
            height: '6px',
            position: 'absolute',
            top: '-20px',
            right: '0px',
            left: '0px',
            margin: 0,
            pointerEvents: 'all',
            transition: 'none',
            '& .vjs-mouse-display': {
                height: 12,
                marginTop: -3,
            },
            '& #thumbnail_hover_video': {
                display: 'flex',
                position: 'absolute',
                top: '-175px',
                transform: 'translateX(-50%)',
                width: '166px',
                height: '118px',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: 0,
                transition: 'opacity 0.05s',
                pointerEvents: 'none',
                '& .mourse_thumbnail': {
                    width: '166px',
                    height: '96px',
                    backgroundSize: '800px 450px, 1600px 900px',
                    // marginTop: 'var(--mrTop, -132px)',
                    // position: 'absolute',
                    // left: '50%',
                    // transform: 'translateX(-50%)',
                    border: '3px solid white',
                    borderRadius: '2px',
                    // marginLeft: 'var(--mrLeft, 0)',
                },
                '& .chapter_title': {
                    fontSize: '14px',
                    padding: '5px 10px',
                    background: 'black',
                    borderRadius: '3px',
                    whiteSpace: 'nowrap',
                    position: 'absolute',
                    bottom: -6,
                    transform: 'translateX(-50%)',
                    left: '50%',
                    '&.pLeft': {
                        left: 0,
                        transform: 'unset',
                    },
                    '&.pRight': {
                        left: 'unset',
                        right: 0,
                        transform: 'unset',
                    }
                },
            },
            '&:hover #thumbnail_hover_video': {
                opacity: 1,
                transition: 'opacity 0.05s',
            },
            '&:hover': {
                boxShadow: '0px 3px 0 rgba(115,133,159,.5), 0px -3px 0 rgba(115,133,159,.5)',
                '& .vjs-load-progress': {
                    boxShadow: '0px 3px 0 rgba(115,133,159,.75), 0px -3px 0 rgba(115,133,159,.75)',
                },
                '& .vjs-play-progress': {
                    boxShadow: '0px 3px 0 var(--colorRed), 0px -3px 0 var(--colorRed)',
                },
            },
        },
        '& .video-js .vjs-control.tooltip-video:not(.not-point)': {
            position: 'relative',
            display: 'inline-block',
            padding: 16,
            width: 6,
            marginLeft: '-3px',
            top: '-13px',
            cursor: 'pointer',
        },
        '& .tooltip-video:not(.not-point).vjs-button>.vjs-icon-placeholder': {
            backgroundColor: '#dddb36',
            width: '5px',
            height: '12px',
            marginTop: '-6px',
            // borderRadius: 10,
        },
        '& .tooltip-video:not(.not-point).type-of-the-lecturer.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: 'white',
        },
        '& .tooltip-video.type-info.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: '#dddb36',
        },
        '& .tooltip-video.type-warning.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: '#ef9117',
        },
        '& .tooltip-video.type-error.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: '#3c2ec9',
        },
        '& .tooltip-video.type-debug.vjs-button>.vjs-icon-placeholder': {
            // backgroundColor: theme.palette.success.light,
        },
        '& .tooltip-video .tooltiptext>p:first-child': {
            marginTop: 0,
        },

        '& .tooltip-video .tooltiptext>p:last-child': {
            marginBottom: 0,
        },
        '& .tooltip-video .tooltiptext .tooltip-type': {
            fontSize: 16,
            margin: 0,
            opacity: 0.6,
        },
        '& .tooltip-video .tooltiptext': {
            pointerEvents: 'none',
            zIndex: 999,
            visibility: 'hidden',
            width: '400px',
            maxWidth: '400px',
            backgroundColor: '#555',
            color: '#fff',
            textAlign: 'left',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '14px',
            position: 'absolute',
            left: '50%',
            marginLeft: '-60px',
            opacity: '0',
            transition: 'opacity 0.3s',
            transform: 'translate(calc(-50% - -60px), calc(-100% - 20px))',
        },
        '& .tooltip-video .tooltiptext p': {
            margin: '8px 0'
        },
        '& .tooltip-video .tooltiptext:not(.not-arrow)::after': {
            content: '""',
            position: 'absolute',
            top: '100%',
            left: '50%',
            marginLeft: '-5px',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: '#555 transparent transparent transparent',
        },
        '& .tooltip-video:hover .tooltiptext': {
            visibility: 'visible',
            opacity: 1,
            lineHeight: '22px',
        },
        '& .video-js .vjs-play-progress:before': {
            display: 'none',
            // zIndex: 3,
            // top: '-3px',
            // fontSize: '12px',
            // borderRadius: '50%',
        },
        '& .video-js .vjs-big-play-button': {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            fontSize: 48,
            border: 'none',
            backgroundColor: 'rgb(43 51 63)',
            zIndex: 1,
            // display: 'none',
        },
        '& .video-js .vjs-loading-spinner': {
            zIndex: 2,
            pointerEvents: 'none',
            margin: '-40px 0 0 -40px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
        },
        '& .video-js .vjs-big-play-button:before': {
            content: '""',
            position: 'absolute',
            zIndex: 0,
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            display: 'block',
            width: '80px',
            height: '80px',
            background: 'var(--colorRed)',
            borderRadius: '50%',
            animation: 'pulse-border 1500ms ease-out infinite',
        },
        '& .video-js .vjs-big-play-button:after': {
            content: '""',
            position: 'absolute',
            zIndex: 1,
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            display: 'block',
            width: '80px',
            height: '80px',
            background: 'var(--colorRed)',
            borderRadius: '50%',
            transition: 'all 200ms',
        },
        '& .video-js .vjs-big-play-button:hover:after': {
            backgroundColor: 'darken(#fa183d, 10%)',
        },
        '& .video-js .vjs-big-play-button:focus,& .video-js:hover .vjs-big-play-button': {
            backgroundColor: 'rgb(84 99 122)',
        },
        '& .video-js .vjs-big-play-button .vjs-icon-placeholder:before': {
            lineHeight: '80px',
            zIndex: 9,
        },
        '& .video-js .vjs-play-progress': {
            backgroundColor: 'var(--colorRed)',
        }
    }
}));