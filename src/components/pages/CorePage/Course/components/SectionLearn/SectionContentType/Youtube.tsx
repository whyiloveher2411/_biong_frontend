import { Box, useTheme } from '@mui/material';
import Loading from 'components/atoms/Loading';
import { useWindowFocusout } from 'components/atoms/WebBrowser';
import { convertHMS } from 'helpers/date';
import { addScript } from 'helpers/script';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CourseLessonProps, ProcessLearning } from 'services/courseService';
import { RootState } from 'store/configureStore';
import { logout, UserProps } from 'store/user/user.reducers';
import CourseLearningContext, { CourseLearningContextProps } from '../../../context/CourseLearningContext';

function Youtube({ lesson, process, style, handleAutoCompleteLesson }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    handleAutoCompleteLesson?: (waitingTime: number) => void,
    style?: React.CSSProperties
}) {

    const theme = useTheme();

    const user = useSelector((state: RootState) => state.user);

    const isFocusout = useWindowFocusout();

    const [showLoading, setShowLoading] = React.useState(true);

    const dispath = useDispatch();

    const navigate = useNavigate();

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

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

                        const uiid = document.getElementById('uid_video');

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

                        window.__messageYT = function (event: MessageEvent<ANY>) {
                            // Check that the event was sent from the YouTube IFrame.
                            if (uiid) {
                                if (!checkHasUElement(uiid, user)) {
                                    navigate('/');
                                    dispath(logout());
                                    window.playeYoutube?.destroy();
                                    return;
                                }
                            }
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

                                    if (data.info.playerState === 0) {
                                        courseLearningContext.nexLesson();
                                    }

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
                        };

                        window.addEventListener("message", window.__messageYT);
                    });
                };

                // window.onYouTubeIframeAPIReady();

            }, 100);
        });

        return () => {
            window.removeEventListener("message", window.__messageYT, false);
            delete window.__messageYT;
        }
    }, [lesson]);

    React.useEffect(() => {
        if (isFocusout) {
            if (window.playeYoutube && window.playeYoutube.pauseVideo) {
                window.playeYoutube.pauseVideo();
            }
        }
    }, [isFocusout]);

    if (lesson.youtube_id) {
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
                    <button className="vjs-control vjs-button" type="button" aria-disabled="false" id="uid_video" style={{ display: 'block', background: 'rgba(0, 0, 0, 0.53)', padding: '10px', zIndex: 99, opacity: 1, fontWeight: 'bold', borderRadius: '8px', color: 'white', top: '10px', right: '10px', pointerEvents: 'none', fontSize: '20px', whiteSpace: 'nowrap', position: 'absolute', height: 'auto', visibility: 'visible', width: 'auto', border: 'none', }}>
                        <img style={{ margin: '0 auto 8px', height: '60px', display: 'block', marginBottom: '8px' }} src="/images/LOGO-image-full.svg" />UID: {user.id}
                    </button>

                    <iframe id={'player_video_youtube_' + lesson.code}
                        src={'https://www.youtube.com/embed/' + lesson.youtube_id + '?enablejsapi=1&modestbranding=1&rel=0'}
                        onLoad={() => { setShowLoading(false); window.onYouTubeIframeAPIReady2() }}
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



function checkHasUElement(uiid: HTMLElement, user: UserProps) {
    if (
        uiid.style.zIndex === '99'
        && uiid.style.opacity === '1'
        && uiid.style.display === 'block'
        && uiid.style.background === 'rgba(0, 0, 0, 0.53)'
        && uiid.style.padding === '10px'
        && uiid.style.fontWeight === 'bold'
        && uiid.style.borderRadius === '8px'
        && uiid.style.color === 'white'
        && uiid.style.pointerEvents === 'none'
        && uiid.style.top === '10px'
        && uiid.style.right === '10px'
        && uiid.style.fontSize === '20px'
        && uiid.style.whiteSpace === 'nowrap'
        && uiid.style.position === 'absolute'
        && uiid.style.visibility === 'visible'
        && uiid.style.width === 'auto'
        && uiid.style.height === 'auto'
        && uiid.style.bottom === ''
        && uiid.style.left === ''
        && uiid.textContent === ('UID: ' + user.id + '')
    ) {
        //@ts-ignore
        if (!uiid.checkVisibility || uiid.checkVisibility({
            checkOpacity: true,  // Check CSS opacity property too
            checkVisibilityCSS: true // Check CSS visibility property too
        })) {
            return true;
        }
    }
    return false;
}