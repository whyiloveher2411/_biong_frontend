import { Box, Theme } from '@mui/material';
import makeCSS from 'components/atoms/makeCSS';
import { convertHMS } from 'helpers/date';
import { addScript } from 'helpers/script';
import jwt_decode from "jwt-decode";
import { Parser } from 'm3u8-parser';
import React from 'react';
import { CourseLessonProps, ProcessLearning } from 'services/courseService';
import './video-js.min.css';
// ffmpeg -i SampleVideo_1280x720_10mb.mp4 -codec: copy -bsf:v h264_mp4toannexb -start_number 0 -hls_time 10 -hls_list_size 0 -f hls filename.m3u8

const useStyle = makeCSS((theme: Theme) => ({
    video: {
        width: 'auto',
        maxWidth: '96%',
        height: '100%',
        minHeight: '75vh',
        // maxHeight: 'var(--maxHeight, calc(100vh - 164px))',
        // maxHeight: 'var(--maxHeight, calc(100vh - 64px))',
        margin: '0 auto',
        '&.video-js .vjs-big-play-button': {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            borderRadius: '50%',
            width: '70px',
            height: '70px',
            fontSize: 42,
            border: 'none',
        },
        '&.video-js .vjs-big-play-button .vjs-icon-placeholder:before': {
            lineHeight: '70px',
        },
        '&.video-js .vjs-play-progress,&.video-js .vjs-play-progress:before': {
            backgroundColor: theme.palette.primary.main,
        }
    }
}));

function Video({ lesson, process, style, handleAutoCompleteLesson }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    handleAutoCompleteLesson?: (waitingTime: number) => void,
    style?: React.CSSProperties
}) {

    const classes = useStyle();

    React.useEffect(() => {
        window.__videoTimeCurrent = 0;
        // addStyleLink('https://vjs.zencdn.net/7.18.1/video-js.css', 'video-js-css', () => {
        //     //
        // });

        if (process) {
            let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo') as HTMLVideoElement | null;

            if (video) {
                video.onabort = function () {
                    //
                };

                video.ontimeupdate = video.onseeking = function () {

                    const videoTimeCurrent = document.querySelector('#videoTimeCurrent .MuiChip-label') as HTMLSpanElement;

                    if (videoTimeCurrent) {
                        window.__videoTimeCurrent = video?.currentTime ?? 0;
                        videoTimeCurrent.innerText = convertHMS(video?.currentTime ?? 0) ?? '00:00';
                    }
                };

                video.onplay = function () {
                    //
                }

                video.onpause = function () {
                    //
                }

                video.onended = function () {
                    if (handleAutoCompleteLesson) {
                        handleAutoCompleteLesson(3000);
                    }
                    // console.log('Video ENDED');
                }
            }

            addScript('/js/video.min.js', 'video.js', () => {

                // addScript('https://unpkg.com/@videojs/http-streaming@2.14.0/dist/videojs-http-streaming.min.js', 'hls', () => {

                if (lesson.video && window.videojs && video) {
                    if (process.content) {

                        let player = window.videojs('videoCourse_livevideo');

                        window.videojs.Vhs.xhr.beforeRequest = function (options: ANY) {

                            let time = Date.now();

                            options.uri = options.uri + '?&access_token=' + localStorage.getItem('access_token') + '&__l=' + window.btoa(lesson.id + '#' + lesson.code + '#' + time + '&v=' + time);
                            // options.uri += '&signature=sdfsdf';
                            // options.uri = options.uri.replace('http://localhost:3033/profile/', 'http://dev.laravel.com/file/temp/uploads/video/clip1/');

                            return options;
                        };

                        let decoded: string[] = jwt_decode(process.content.replaceAll('#.' + process.str + '_#', process.str));

                        const parser = new Parser();

                        const manifest = decoded.join('\n');

                        parser.push(manifest);
                        parser.end();

                        player.src({
                            src: `data:application/vnd.videojs.vhs+json,${JSON.stringify(parser.manifest)}`,
                            type: 'application/x-mpegURL',
                            method: 'POST',
                        });

                        if (!window.__hls) window.__hls = {};

                        window.__hls = {
                            video: video,
                            player: player
                        };

                        player.ready(function () {

                            let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement | null;

                            if (video) {
                                if (window.__hlsTime?.[lesson.code]) {
                                    video.currentTime = (window.__hlsTime?.[lesson.code] ?? 0) as number;

                                    window.__videoTimeCurrent = video.currentTime;

                                    delete window.__hlsTime;
                                    video.play();

                                    const main = document.querySelector('#popupLearning');
                                    if (main) {
                                        main.closest('.custom_scroll')?.scrollTo({ behavior: 'smooth', top: 0 });
                                    }
                                }
                            }
                        });
                    }

                }
                // });

            });

            return () => {
                let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo') as HTMLVideoElement | null;
                if (!video) {
                    if (window.__hls) {
                        window.__hls.player.dispose();
                        delete window.__hls;
                    }
                }
            }
        }
    }, [lesson, process]);

    return (
        <Box
            sx={{
                textAlign: 'center',
                width: '100%',
                background: 'rgb(0 0 0/1)',
                maxHeight: '75vh',
            }}
        >

            <video
                className={'video-js vjs-default-skin ' + classes.video}
                style={style}
                controls
                id={'videoCourse_livevideo'}
                data-setup='{ "playbackRates": [0.5, 1, 1.5, 2] }'
            // poster="https://media.istockphoto.com/photos/coding-software-concept-developer-working-on-code-picture-id1284552053?s=612x612"
            >
                Your browser does not support HTML video.
            </video>
        </Box>
    )
}

export default Video