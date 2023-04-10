import { Theme } from '@mui/system';
import 'assets/css/video-js.min.css';
import Box from 'components/atoms/Box';
import makeCSS from 'components/atoms/makeCSS';
import { addScript } from 'helpers/script';
import React from 'react';


function Video({ youtube_id, title }: { youtube_id: string, title: string }) {

    const [times, setTimes] = React.useState(-1);

    React.useEffect(() => {
        setTimes(prev => prev + 1);
    }, [youtube_id]);

    if (times % 2 === 0) {
        return <YoutubeContent
            youtube_id={youtube_id}
            title={title}
        />
    }

    return <Box>
        <YoutubeContent
            youtube_id={youtube_id}
            title={title}
        />
    </Box>

}

function YoutubeContent({ youtube_id }: { youtube_id: string, title: string }) {

    const classes = useStyle();

    const timeTracking = React.useRef<{ [key: number]: true }>({});

    const playerRef = React.useRef<ANY>(null);

    const loadTimeTracking = () => {
        if (window.videojs && playerRef.current) {

            const totalTime = playerRef.current.duration() ?? 0;

            const temp = timeTracking.current;
            temp[0] = true;
            temp[totalTime] = true;
            //@ts-ignore
            const times: number[] = Object.keys(temp);

            times.sort((a, b) => a - b);
            let dk = true;
            times.forEach((time: number, index) => {
                if (index < (times.length - 1)) {
                    if ((times[index + 1] - time) > 5) {
                        dk = false;
                        return false;
                    }
                }
            });

            if (dk) {
                return true;
            }
            return false;
        }
    };


    React.useEffect(() => {
        addScript('/js/video.min.js', 'video.js', () => {
            addScript('/js/videojs-youtube.min.js', 'videojs-youtube', function () {

                const player = window.videojs('youtube_iframe_' + youtube_id, {
                    controlBar: {},
                    controls: true,
                    techOrder: ['youtube'],
                    enablePrivacyEnhancedMode: true,
                    sources: [
                        {
                            src: "https://youtu.be/" + youtube_id,
                            type: "video/youtube"
                        }
                    ],
                }, function () {
                    // alert(2);
                });

                playerRef.current = player;

                player.on('timeupdate', function () {
                    window.__videoTimeCurrent = player.currentTime();
                    timeTracking.current[window.__videoTimeCurrent] = true;
                });

                player.on('ended', function () {
                    loadTimeTracking();
                });

                player.on('firstplay', async function () {
                    window.__playFirstInteract = true;
                });

                player.on('canplaythrough', function () {
                    // console.log(123123);
                });

                player.on('pause', function () {
                    loadTimeTracking();
                });

                document.getElementById('youtube_iframe_' + youtube_id)?.parentElement?.addEventListener('click', function () {
                    if (player.paused()) {
                        player.play()
                    } else {
                        player.pause();
                    }
                });

                const buttonPlay = document.getElementsByClassName('vjs-big-play-button')[0];

                buttonPlay?.addEventListener('click', function () {
                    (async () => {
                        while (player?.paused()) {
                            player?.play();
                            await new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(10);
                                }, 100);
                            });
                        }

                        while (player?.paused()) {
                            player?.play();
                            await new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve(10);
                                }, 100);
                            });
                        }

                        if ((player.readyState() === 4)) {
                            player?.play();
                            return;
                        }

                        setTimeout(() => {
                            player?.play();
                        }, 300);

                        setTimeout(() => {
                            player?.play();
                        }, 500);

                        setTimeout(() => {
                            player?.play();
                        }, 700);

                        setTimeout(() => {
                            player?.play();
                        }, 1000);

                    })();
                });

                document.getElementById('youtube_iframe_' + youtube_id)?.addEventListener('dblclick', function () {
                    if (player.isFullscreen()) {
                        player.exitFullscreen();
                    } else {
                        player.requestFullscreen();
                    }
                });

                player.on('ready', function () {

                    //
                });

                // });
            }, 10, 1000, function () {

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
            delete window.__loaded_video;
            delete window.changeVideoTime;
            if (playerRef.current) {
                playerRef.current.dispose();
                delete window.__hls;
            }
        };

    }, []);

    return (
        <Box
            sx={{
                textAlign: 'center',
                width: '100%',
                background: 'rgb(0 0 0/1)',
                height: 0,
                paddingBottom: 'clamp(50vh, 56.25%, calc(100vh - 112px))',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <video
                className={'video-js vjs-default-skin ' + classes.video}
                style={{
                    position: 'absolute',
                    height: '100%',
                }}
                controls
                id={'youtube_iframe_' + youtube_id}
            >
                Your browser does not support HTML video.
            </video>
        </Box>
    )
}

export default Video


const useStyle = makeCSS((theme: Theme) => ({
    video: {
        width: 'auto',
        height: '100%',
        minHeight: 'clamp(50vh, 56.25%, calc(100vh - 112px))',
        margin: '0 auto',
        overflow: 'hidden',
        '& .vjs-poster': {
            display: 'none',
        },
        '& iframe': {
            pointerEvents: 'none',
        },
        '&.video-js': {
            zIndex: 1030,
            maxWidth: 'unset',
            width: '100%',
            fontSize: 14,
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
                    fontFamily: 'monospace, Helvetica, Arial, sans-serif',
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
                margin: '0 15px',
                width: 'auto',
                opacity: 0,
                transition: 'all 300ms',
                display: 'flex',
                backgroundColor: 'transparent',
                '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    height: '146px',
                    bottom: '0px',
                    left: '-20px',
                    right: '-20px',
                    backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAACSCAYAAACE56BkAAAAAXNSR0IArs4c6QAAAPVJREFUKFNlyOlHGAAcxvHuY93H1n1fW1v3fbej+zAmI5PIRGYiM5JEEkkiiSSRRPoj83nze9Pz4uPrSUh4tURPEpKDFJWKtCBdZSAzeKOykB3kqFzkBfmqAIVBkSrG2+CdKkEpyoJyVYHKoEpVoyaoVXWoDxpUI5qCZtWC98EH1YqPwSfVhvagQ3WiK+hWPegN+lQ/BoJBNYThYESNYgzjwYSaDD6rL/iKb8GUmsZMMKvmMB8sqEUsYRnf8QMr+IlV/MIa1rGB39jEFv7gL7axg3/4j13sYR8HOMQRjnGCU5zhHBe4xBWucYNb3OEeD3jEE55fAOMNI9cZbRZdAAAAAElFTkSuQmCC)',
                    zIndex: 0,
                },
            },
            '&.vjs-paused .vjs-control-bar,&.vjs-ended .vjs-control-bar, &:hover .vjs-control-bar': {
                opacity: 1,
            },
            '&.vjs-paused .vjs-big-play-button': {
                display: 'block'
            },
            '& .vjs-tech': {
                width: 'auto',
                // left: '50%',
                // transform: 'translateX(-50%)',
            },
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
        '&.video-js .vjs-remaining-time': {
            display: 'none',
        },
        '&.video-js .vjs-current-time, &.video-js .vjs-time-divider, &.video-js .vjs-duration': {
            display: 'block',
        },
        '&.video-js .vjs-time-divider': {
            lineHeight: '28px',
            padding: 0,
        },
        '&.video-js .vjs-current-time': {
            paddingRight: 0,
        },
        '&.video-js .vjs-duration': {
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
        '&.video-js .vjs-progress-control': {
            position: 'initial',
            pointerEvents: 'none',
        },
        '&.video-js .vjs-progress-control .vjs-progress-holder': {
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
        '&.video-js .vjs-control.tooltip-video:not(.not-point)': {
            position: 'relative',
            display: 'inline-block',
            padding: '16px 0',
            width: 5,
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
            zIndex: 9999,
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

        '&.video-js .vjs-play-progress:before': {
            display: 'none',
            // zIndex: 3,
            // top: '-3px',
            // fontSize: '12px',
            // borderRadius: '50%',
        },
        '&.video-js .vjs-big-play-button': {
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
        '&.video-js .vjs-loading-spinner': {
            zIndex: 2,
            pointerEvents: 'none',
            margin: '-40px 0 0 -40px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
        },
        '&.video-js .vjs-big-play-button:before': {
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
        '&.video-js .vjs-big-play-button:after': {
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
        '&.video-js .vjs-big-play-button:hover:after': {
            backgroundColor: 'darken(#fa183d, 10%)',
        },
        '&.video-js .vjs-big-play-button:focus,&.video-js:hover .vjs-big-play-button': {
            backgroundColor: 'rgb(84 99 122)',
        },
        '&.video-js .vjs-big-play-button .vjs-icon-placeholder:before': {
            lineHeight: '80px',
            zIndex: 9,
        },
        '&.video-js .vjs-play-progress': {
            backgroundColor: 'var(--colorRed)',
        },
    }
}));
