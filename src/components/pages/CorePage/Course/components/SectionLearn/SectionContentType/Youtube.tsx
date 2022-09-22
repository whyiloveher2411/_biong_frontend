import { Box, useTheme } from '@mui/material';
import Loading from 'components/atoms/Loading';
import { convertHMS } from 'helpers/date';
import { addScript } from 'helpers/script';
import React from 'react';
import { CourseLessonProps, ProcessLearning } from 'services/courseService';

function Youtube({ lesson, process, style, handleAutoCompleteLesson }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    handleAutoCompleteLesson?: (waitingTime: number) => void,
    style?: React.CSSProperties
}) {

    const theme = useTheme();

    const [showLoading, setShowLoading] = React.useState(true);

    React.useEffect(() => {
        window.__videoTimeCurrent = 0;
        setShowLoading(true);
        addScript('https://www.youtube.com/iframe_api', 'youtube_iframe_api', () => {
            setTimeout(() => {

                window.onYouTubeIframeAPIReady2 = () => {

                    window.YT.ready(function () {
                        // if (window.player) {
                        //     window.player.loadVideoById(
                        //         {
                        //             'videoId': lesson.id_video,
                        //         }

                        //         );
                        // } else {

                        window.playeYoutube = new window.YT.Player('player_video_youtube_' + lesson.code);
                        // }

                        let iframeWindow = window.playeYoutube.getIframe().contentWindow;

                        // So we can compare against new updates.
                        let lastTimeUpdate = 0;

                        window.changeVideoTime = (time: number) => {

                            if (window.playeYoutube && window.playeYoutube.playVideo && window.playeYoutube.seekTo) {
                                window.playeYoutube.playVideo();
                                window.playeYoutube.seekTo(time);
                            }
                        }

                        if (window.__hlsTime?.[lesson.code] && window.playeYoutube.playVideo && window.playeYoutube.seekTo) {
                            window.changeVideoTime(window.__hlsTime?.[lesson.code] ?? 0);
                            delete window.__hlsTime;
                        }
                        window.addEventListener("message", function (event) {
                            // Check that the event was sent from the YouTube IFrame.
                            if (event.source === iframeWindow) {
                                let data = JSON.parse(event.data);

                                // The "infoDelivery" event is used by YT to transmit any
                                // kind of information change in the player,
                                // such as the current time or a playback quality change.
                                if (
                                    data.event === "infoDelivery" &&
                                    data.info &&
                                    data.info.currentTime
                                ) {
                                    // currentTime is emitted very frequently (milliseconds),
                                    // but we only care about whole second changes.
                                    let time = Math.floor(data.info.currentTime);

                                    if (time !== lastTimeUpdate) {
                                        lastTimeUpdate = time;

                                        const videoTimeCurrent = document.querySelector('#videoTimeCurrent .MuiChip-label') as HTMLSpanElement;

                                        if (videoTimeCurrent) {
                                            window.__videoTimeCurrent = time ? time : 0;
                                            videoTimeCurrent.innerText = convertHMS(time ?? 0) ?? '00:00';
                                        }
                                    }
                                }
                            }
                        });
                    });
                };

                // window.onYouTubeIframeAPIReady();

            }, 100);
        });

    }, [lesson]);

    if (lesson.id_video) {
        return (
            <Box
                sx={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    background: theme.palette.dividerDark,
                }}
            >
                {
                    showLoading &&
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bottom: 0
                        }}
                    >
                        <Loading open={true} isWarpper />
                    </Box>
                }
                <Box
                    sx={{
                        opacity: showLoading ? 0 : 1,
                        transition: 'all 300ms',
                    }}
                >
                    <iframe id={'player_video_youtube_' + lesson.code}
                        src={'https://www.youtube.com/embed/' + lesson.id_video + '?enablejsapi=1'}
                        onLoad={() => { setShowLoading(false); window.onYouTubeIframeAPIReady2() }}
                        frameBorder="0"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    ></iframe>
                </Box>
            </Box>
        )
    }

    return null;
}

export default Youtube