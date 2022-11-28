import { Box, Theme } from '@mui/material';
import makeCSS from 'components/atoms/makeCSS';
import { convertHMS } from 'helpers/date';
import { getImageUrl } from 'helpers/image';
import { addScript } from 'helpers/script';
import useQuery from 'hook/useQuery';
import jwt_decode from "jwt-decode";
import { Parser } from 'm3u8-parser';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import courseService, { CourseLessonProps, CourseNote, ProcessLearning } from 'services/courseService';
import { RootState } from 'store/configureStore';
import { logout, UserProps } from 'store/user/user.reducers';
import CourseLearningContext, { CourseLearningContextProps } from '../../../context/CourseLearningContext';
import { getAutolayNextLesson } from '../../../CourseLearning';
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
        overflow: 'hidden',
        '&.video-js': {
            zIndex: 1030,
            '& .vjs-tech': {
                width: 'auto',
                left: '50%',
                transform: 'translateX(-50%)',
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
            zIndex: 100,
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
            position: 'absolute',
            top: '-20px',
            right: '0px',
            left: '0px',
            margin: 0,
            pointerEvents: 'all',
        },
        '&.video-js .vjs-control.tooltip-video:not(.not-point)': {
            position: 'relative',
            display: 'inline-block',
            padding: 12,
            width: 5,
            top: '-9px',
            cursor: 'pointer',
        },
        '& .tooltip-video:not(.not-point).vjs-button>.vjs-icon-placeholder': {
            backgroundColor: 'red',
            width: '5px',
            height: '12px',
            marginTop: '-6px',
            marginLeft: '-3px',
            borderRadius: 10,
        },
        '& .tooltip-video:not(.not-point).type-of-the-lecturer.vjs-button>.vjs-icon-placeholder': {
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

function VideoIframe({ lesson, process, style }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    style?: React.CSSProperties
}) {

    const classes = useStyle();

    const [notes, setNotes] = React.useState<null | CourseNote[]>(null);

    const urlParam = useQuery({ 'tab_course_learn': '' });

    const isLoadVideo = React.useRef(false);

    const user = useSelector((state: RootState) => state.user);

    const dispath = useDispatch();

    const navigate = useNavigate();

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

                    // const divVideo = document.getElementById('videoCourse_livevideo');
                    // let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement | null;

                    // if (divVideo && video) {
                    //     divVideo.style.width = video.offsetWidth + 'px';
                    //     divVideo.style.height = video.offsetHeight + 'px';
                    // }


                    window.__playFirstInteract = true;
                    const uiid = document.getElementById('uid_video');
                    if (uiid) {
                        if (!checkHasUElement(uiid, user)) {
                            if (window.__hls) {
                                navigate('/');
                                window.__hls.player.dispose();
                                delete window.__hls;
                                dispath(logout());
                            }
                        }
                    }
                };

                video.onpause = function () {
                    //
                }

                video.onended = function () {
                    if (getAutolayNextLesson()) {
                        courseLearningContext.nexLesson();
                    }
                }
            }

            addScript('/js/video.min.js', 'video.js', () => {

                // addScript('https://unpkg.com/@videojs/http-streaming@2.14.0/dist/videojs-http-streaming.min.js', 'hls', () => {

                if (lesson.video && window.videojs && video) {
                    if (process.content) {

                        let player = window.videojs('videoCourse_livevideo', {
                            controlBar: {
                                // children: [
                                //     "playToggle",
                                //     "VolumePanel",
                                //     "TimeTooltip",
                                //     'ProgressControl',
                                //     'PlaybackRateMenuButton',
                                //     'PictureInPictureToggle',
                                //     'FullscreenToggle'
                                // ]
                            },
                        });
                        player.poster(getImageUrl(lesson.video_poster ?? '/images/video-thumbnail.jpg', '/images/video-thumbnail.jpg'));
                        const buttons = player.getChild('ControlBar').getChild('ProgressControl').el().querySelectorAll('.vjs-video-note');

                        for (let index = 0; index < buttons.length; index++) {
                            buttons[index].remove();
                        }

                        window.videojs.Vhs.xhr.beforeRequest = function (options: ANY) {

                            let time = Date.now();

                            options.uri = options.uri + '?&access_token=' + localStorage.getItem('access_token') + '&__l=' + window.btoa(lesson.id + '#' + lesson.code + '#' + time + '#' + lesson.video + '#@') + '&v=' + time;

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

                            const uiid = document.getElementById('uid_video');
                            if (uiid) {

                                if (checkHasUElement(uiid, user)) {

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

                                } else {
                                    if (window.__hls) {
                                        navigate('/');
                                        window.__hls.player.dispose();
                                        delete window.__hls;
                                        dispath(logout());
                                    }
                                }
                            }

                        });

                        if (!isLoadVideo.current) {
                            isLoadVideo.current = true;

                            const buttonsCustom = window.__hls.player.getChild('ControlBar').el().querySelectorAll('.custom-button');

                            for (let index = 0; index < buttonsCustom.length; index++) {
                                buttonsCustom[index].remove();
                            }

                            let Button = window.videojs.getComponent('Button');

                            let uidButton = new Button(player, {
                                clickHandler: () => {
                                    //
                                }
                            });

                            const uidButtonEl: HTMLElement = uidButton.el();
                            uidButtonEl.id = 'uid_video';
                            uidButtonEl.innerHTML = '<img style=" margin: 0 auto 8px;height: 60px; display: block;margin-bottom: 8px;" src="/images/LOGO-image-full.svg" />UID: ' + user.id;
                            uidButtonEl.style.display = 'block';
                            uidButtonEl.style.background = 'rgba(0, 0 ,0 , 0.53)';
                            uidButtonEl.style.padding = '10px';
                            uidButtonEl.style.zIndex = '99';
                            uidButtonEl.style.opacity = '1';
                            uidButtonEl.style.fontWeight = 'bold';
                            uidButtonEl.style.borderRadius = '8px';
                            uidButtonEl.style.color = 'white';
                            uidButtonEl.style.top = '10px';
                            uidButtonEl.style.right = '10px';
                            uidButtonEl.style.pointerEvents = 'none';
                            uidButtonEl.style.fontSize = '20px';
                            uidButtonEl.style.whiteSpace = 'nowrap';
                            uidButtonEl.style.position = 'absolute';
                            uidButtonEl.style.height = 'auto';
                            uidButtonEl.style.visibility = 'visible';
                            uidButtonEl.style.width = 'auto';
                            uidButtonEl.style.border = 'none';

                            player.addChild(uidButton, {});


                            addButtonToVideoEl(
                                player,
                                'Tua lại 10 giây',
                                () => {
                                    let video: HTMLVideoElement = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement;
                                    if (video) {
                                        video.currentTime = video.currentTime - 10 > 0 ? video.currentTime - 10 : 0;
                                        video.play();
                                    }
                                },
                                '<svg style="width: 22px;height: 22px;fill: white;" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="Replay10Icon"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path><path d="M10.89 16h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.11-.32.04-.29.04-.48v-.97z"></path></svg>',
                                2,
                                'Tua lại 10 giây'
                            );


                            addButtonToVideoEl(
                                player,
                                'Tua tới 10 giây',
                                () => {
                                    let video: HTMLVideoElement = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement;
                                    if (video) {
                                        video.currentTime = video.currentTime + 10;
                                        video.play();
                                    }
                                },
                                '<svg style="width: 22px;height: 22px;fill: white;" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="Forward10Icon" tabindex="-1" title="Forward10"><path d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2z"></path><path d="M10.86 15.94v-4.27h-.09L9 12.3v.69l1.01-.31v3.26zm1.39-2.5v.74c0 1.9 1.31 1.82 1.44 1.82.14 0 1.44.09 1.44-1.82v-.74c0-1.9-1.31-1.82-1.44-1.82-.14 0-1.44-.09-1.44 1.82zm2.04-.12v.97c0 .77-.21 1.03-.59 1.03s-.6-.26-.6-1.03v-.97c0-.75.22-1.01.59-1.01.38-.01.6.26.6 1.01z"></path></svg>',
                                3,
                                'Tua tới 10 giây'
                            );

                            addButtonToVideoEl(
                                player,
                                'Thêm ghi chú',
                                () => {
                                    let video: HTMLVideoElement = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement;
                                    if (video) {
                                        video.pause();
                                    }

                                    urlParam.changeQuery({
                                        tab_course_learn: 'notes',
                                    });
                                    setTimeout(() => {
                                        document.querySelector('.section-course-tab')?.scrollIntoView({
                                            behavior: 'smooth'
                                        });
                                    }, 100);
                                },
                                '<svg style="width: 22px;height: 22px;fill:white;" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NoteAltOutlinedIcon"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path><path d="m15.08 11.03-2.12-2.12L7 14.86V17h2.1zm1.77-1.76c.2-.2.2-.51 0-.71l-1.41-1.41c-.2-.2-.51-.2-.71 0l-1.06 1.06 2.12 2.12 1.06-1.06z"></path></svg>',
                                4,
                                'Thêm ghi chú'
                            );


                            addButtonToVideoEl(
                                player,
                                'Chuyển đổi chế độ xem',
                                courseLearningContext.LessonList.onToggle,
                                '<svg style="width: 22px;height: 22px;fill: white;" MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SettingsEthernetIcon"><path d="M7.77 6.76 6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"></path></svg>',
                                null,
                                'Chuyển đổi chế độ xem',
                                'left:-40px;',
                                true
                            );

                            // addButtonToVideoEl(
                            //     player,
                            //     'Transcript',
                            //     () => {
                            //         window.showMessage(__('Chức năng đang được phát triển.'), 'info');
                            //     },
                            //     '<svg style="width: 22px;height: 22px;fill: white;" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="FeedOutlinedIcon"><path d="M16 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8l-5-5zm3 16H5V5h10v4h4v10zM7 17h10v-2H7v2zm5-10H7v2h5V7zm-5 6h10v-2H7v2z"></path></svg>',
                            //     10,
                            //     'Transcript',
                            // );

                            addButtonToVideoEl(
                                player,
                                'Tự động phát bài học tiếp theo',
                                (element) => {
                                    if (element) {
                                        const inputCheckbox = element.querySelector('input[type="checkbox"]') as HTMLInputElement;
                                        if (inputCheckbox) {
                                            inputCheckbox.checked = !inputCheckbox.checked;
                                            courseLearningContext.setAutoplayNextLesson(inputCheckbox.checked);
                                            courseService.me.settingAccount.changeSettingAutoplayNextLesson(inputCheckbox.checked);
                                        }
                                    }
                                },
                                `<label class="switch" style="pointer-events: none;">
                                    <input type="checkbox" ${getAutolayNextLesson() ? 'checked' : ''}>
                                    <span class="slider round"></span>
                                </label>`,
                                10,
                                'Tự động phát bài học tiếp theo',
                                '',
                                false,
                                (buttonAutoPlay) => {
                                    buttonAutoPlay.style.paddingLeft = '10px';
                                    buttonAutoPlay.style.paddingRight = '10px';
                                    buttonAutoPlay.style.width = 'auto';
                                }
                            );


                        }
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

    const loadNoteOfVideoIframe = async () => {
        const notes = await courseService.course.getVideoNote(lesson.id);
        setNotes(notes);
        loadNotesToVideo();
    }

    React.useEffect(() => {
        loadNoteOfVideoIframe();

        window._loadNoteOfVideoIframe = loadNoteOfVideoIframe;

        return () => {
            delete window._loadNoteOfVideoIframe;
        };

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
                overflow: 'hidden',
            }}
        >

            <video
                className={'video-js vjs-default-skin ' + classes.video}
                style={{
                    ...style,
                    maxHeight: '75vh',
                }}
                controls
                id={'videoCourse_livevideo'}
                data-setup='{ "playbackRates": [0.5, 1, 1.5, 2] }'
                poster={getImageUrl(lesson.video_poster ?? '/images/video-thumbnail.jpg', '/images/video-thumbnail.jpg')}
            >
                Your browser does not support HTML video.
            </video>
        </Box>
    )
}

export default VideoIframe

function addButtonToVideoEl(player: ANY, title: string, eventClick: (element: HTMLElement) => void, icon: string, index: number | null, tooltip?: string, styleTooltip?: string, disableArrowTooltip = false, customButton?: (buttonEl: ANY) => void) {

    let Button = window.videojs.getComponent('Button');

    let expandedButton = new Button(player, {
        clickHandler: () => {
            eventClick(expandedButtonEl as HTMLElement);
        }
    });

    const expandedButtonEl = expandedButton.el();
    expandedButton.controlText(title);
    expandedButtonEl.classList.add('custom-button');

    if (tooltip) {
        expandedButtonEl.classList.add('tooltip-video');
        expandedButtonEl.classList.add('not-point');
        expandedButtonEl.querySelector('.vjs-control-text').outerHTML = '<span class="tooltiptext ' + (disableArrowTooltip ? 'not-arrow' : '') + '" style="' + (styleTooltip ?? '') + 'white-space: nowrap;width: auto;margin-top: -15px;">' + tooltip + '</span>';
    }

    expandedButtonEl.style.cursor = 'pointer';

    expandedButtonEl.querySelector('.vjs-icon-placeholder').innerHTML = icon;

    if (customButton) {
        customButton(expandedButtonEl);
    }

    if (index !== null) {
        player.getChild('ControlBar').addChild(expandedButton, {}, index);
    } else {
        player.getChild('ControlBar').addChild(expandedButton, {});
    }

    return expandedButtonEl;
}

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
        return true;
        //@ts-ignore
        if (!uiid.checkVisibility || uiid.checkVisibility({
            checkOpacity: true,  // Check CSS opacity property too
            checkVisibilityCSS: true // Check CSS visibility property too
        })) {
            return true;
        }
    }

    alert('Vui lòng làm mới trang để tiếp tục')
    return false;
}