import { Box, Theme } from '@mui/material';
import makeCSS from 'components/atoms/makeCSS';
import { convertHMS } from 'helpers/date';
import { addScript } from 'helpers/script';
import jwt_decode from "jwt-decode";
import { Parser } from 'm3u8-parser';
import React from 'react';
import courseService, { CourseLessonProps, CourseNote, ProcessLearning } from 'services/courseService';
import CourseLearningContext, { CourseLearningContextProps } from '../../../context/CourseLearningContext';
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
        '&.video-js': {
            zIndex: 1030,
        },
        '&.video-js .vjs-control': {

        },
        '&.video-js .vjs-control.tooltip-video': {
            position: 'relative',
            display: 'inline-block',
            padding: 12,
            width: 5,
            top: '-9px',
            cursor: 'pointer',
        },
        '& .tooltip-video.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: 'red',
            width: '5px',
            height: '12px',
            marginTop: '-6px',
            marginLeft: '-3px',
            borderRadius: 10,
        },
        '& .tooltip-video.type-of-the-lecturer.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: '#dddb36',
        },
        '& .tooltip-video.type-info.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: theme.palette.info.main,
        },
        '& .tooltip-video.type-warning.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: theme.palette.warning.main,
        },
        '& .tooltip-video.type-error.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: theme.palette.error.main,
        },
        '& .tooltip-video.type-debug.vjs-button>.vjs-icon-placeholder': {
            backgroundColor: theme.palette.success.main,
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
            zIndex: 1,
            left: '50%',
            marginLeft: '-60px',
            opacity: '0',
            transition: 'opacity 0.3s',
            transform: 'translate(calc(-50% - -60px), calc(-100% - 20px))',
        },
        '& .tooltip-video .tooltiptext p': {
            margin: '8px 0'
        },
        '& .tooltip-video .tooltiptext::after': {
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
        '&.video-js .vjs-progress-holder': {
            height: '6px',
        },
        '&.video-js .vjs-play-progress:before': {
            zIndex: 3,
            top: '-3px',
            fontSize: '12px',
            borderRadius: '50%',
        },
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

function Video({ lesson, process, style }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    style?: React.CSSProperties
}) {

    const classes = useStyle();

    const [notes, setNotes] = React.useState<null | CourseNote[]>(null);

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

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
                    window.__playFirstInteract = true;
                }

                video.onpause = function () {
                    //
                }

                video.onended = function () {
                    courseLearningContext.nexLesson();
                }
            }

            addScript('/js/video.min.js', 'video.js', () => {

                // addScript('https://unpkg.com/@videojs/http-streaming@2.14.0/dist/videojs-http-streaming.min.js', 'hls', () => {

                if (lesson.video && window.videojs && video) {
                    if (process.content) {

                        let player = window.videojs('videoCourse_livevideo', {
                            controlBar: {
                                volumePanel: {
                                    inline: false
                                }
                            },
                        });

                        const buttons = player.getChild('ControlBar').getChild('ProgressControl').el().querySelectorAll('.vjs-video-note');

                        for (let index = 0; index < buttons.length; index++) {
                            buttons[index].remove();
                        }

                        window.playerDemo = player;

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

                        // const myButton = player.getChild('ControlBar').getChild('ProgressControl').getChild('SeekBar').addChild('button', {
                        //     controlText: 'My button',
                        //     className: 'vjs-video-note'
                        // });

                        // myButton.el().style.backgroundColor = 'red';
                        // myButton.el().style.position = 'absolute';
                        // myButton.el().style.left = '50%';
                        // myButton.el().style.width = '5px';
                        // myButton.el().style.zIndex = 1;
                        // myButton.controlText('My button');
                        // myButton.addClass('vjs-visible-text');

                        // player.controlBar.progressControl.trimVideo = player.controlBar.progressControl.addChild(
                        //     new window.videojs.TrimVideo(player, {
                        //         el: window.videojs.createEl(null, {
                        //             className: 'vjs-trim-start-button vjs-menu-button',
                        //             innerHTML: '<div style="">words and words</div>',
                        //             role: 'button'
                        //         }),
                        //         seekBar: false, // either this
                        //         children: { seekBar: false } // or this
                        //     })
                        // );

                        player.ready(function () {
                            loadNotesToVideo();

                            let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement | null;

                            if (video) {

                                if (window.__hlsTime?.[lesson.code]) {

                                    window.changeVideoTime = (time: number) => {
                                        let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement | null;
                                        if (video) {
                                            video.currentTime = time;
                                            video.play();
                                        }
                                    }

                                    window.changeVideoTime((window.__hlsTime?.[lesson.code] ?? 0) as number)

                                    window.__videoTimeCurrent = video.currentTime;

                                    delete window.__hlsTime;

                                    const main = document.querySelector('#popupLearning');
                                    if (main) {
                                        main.closest('.custom_scroll')?.scrollTo({ behavior: 'smooth', top: 0 });
                                    }
                                }

                                let isPlaying = video.currentTime > 0 && !video.paused && !video.ended
                                    && video.readyState > video.HAVE_CURRENT_DATA;

                                if (!isPlaying && window.__playFirstInteract) {
                                    setTimeout(() => {
                                        video?.play();
                                    }, 1000);
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

    React.useEffect(() => {
        (async () => {
            const notes = await courseService.course.getVideoNote(lesson.id);
            setNotes(notes);
            loadNotesToVideo();
        })()
    }, [lesson]);

    const loadNotesToVideo = () => {

        if (window.videojs && window.__hls?.player) {

            const buttons = window.__hls.player.getChild('ControlBar').getChild('ProgressControl').el().querySelectorAll('.vjs-video-note');

            for (let index = 0; index < buttons.length; index++) {
                buttons[index].remove();
            }

            if (notes) {

                if (lesson.video_notes) {
                    for (let index = 0; index < lesson.video_notes.length; index++) {
                        const element = lesson.video_notes[index];
                        element.type_note = 'of-the-lecturer';
                        notes.push(element);
                    }
                }

                const totalTime = Number(lesson.time);

                for (let index = 0; index < notes.length; index++) {
                    const element = notes[index];

                    const myButton = window.__hls.player.getChild('ControlBar').getChild('ProgressControl').getChild('SeekBar').addChild('button');

                    const button = myButton.el();

                    button.style.position = 'absolute';
                    button.style.left = 'calc(' + Number((Number(element.time) * 100) / totalTime).toFixed(2) + '% - 15px)';
                    // button.style.width = '5px';
                    // button.style.cursor = 'pointer';
                    button.style.zIndex = 1;

                    if (element.type_note === 'of-the-lecturer') {
                        button.querySelector('.vjs-control-text').outerHTML = '<span class="tooltiptext"><h4 class="tooltip-type">Ghi chú từ giảng viên</h4>' + element.content + '</span>';
                    } else {
                        button.querySelector('.vjs-control-text').outerHTML = '<span class="tooltiptext">' + element.content + '</span>';
                    }

                    button.classList.add('vjs-video-note');
                    button.classList.add('tooltip-video');

                    if (element.type_note) {
                        button.classList.add('type-' + element.type_note);
                    }

                    button.querySelector('.tooltiptext').addEventListener('click', function (e: Event) {
                        e.stopPropagation();
                        e.preventDefault();
                        let video: HTMLVideoElement = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement;
                        video.currentTime = Number(element.time ?? 0.1);
                        video.play();
                    });

                }
            }
        }
    }

    React.useEffect(() => {
        loadNotesToVideo();
    }, [notes]);


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