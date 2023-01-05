import { Box, Theme } from '@mui/material';
import Loading from 'components/atoms/Loading';
import makeCSS from 'components/atoms/makeCSS';
import { convertHMS } from 'helpers/date';
import { getImageUrl } from 'helpers/image';
import { addScript } from 'helpers/script';
import { convertTimeStrToTimeInt } from 'helpers/string';
import jwt_decode from "jwt-decode";
import { Parser } from 'm3u8-parser';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import courseService, { CourseLessonProps, CourseNote, ProcessLearning } from 'services/courseService';
import { RootState } from 'store/configureStore';
import { logout } from 'store/user/user.reducers';
import { checkHasUElementLogo, getAutolayNextLesson } from '../../../CourseLearning';
import CourseLearningContext, { CourseLearningContextProps } from '../../../context/CourseLearningContext';
import { IChapterVideo, ShowNoteItem, addButtonToVideoEl } from './Youtube';
import './video-js.min.css';
// ffmpeg -i SampleVideo_1280x720_10mb.mp4 -codec: copy -bsf:v h264_mp4toannexb -start_number 0 -hls_time 10 -hls_list_size 0 -f hls filename.m3u8


function VideoIframe({ lesson, process, style }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    style?: React.CSSProperties
}) {

    const [times, setTimes] = React.useState(-1);

    const [dataNoteOpen, setDataNoteOpen] = React.useState<{
        anchorEl: null | HTMLButtonElement,
        open: boolean,
        content: CourseNote | null,
        alwayShowNote: boolean,
        time: number,
        isHoverContent: boolean,
        clickAddNoteInVideo?: boolean,
    }>({
        anchorEl: null,
        open: false,
        content: null,
        alwayShowNote: false,
        isHoverContent: false,
        time: 0,
    });

    React.useEffect(() => {
        setTimes(prev => prev + 1);
    }, [lesson]);

    if (times < 0) {
        return <Box
            sx={{
                textAlign: 'center',
                width: '100%',
                background: 'rgb(0 0 0/1)',
                height: 0,
                paddingBottom: 'clamp(50vh, 56.25%, calc(100vh - 112px))',
                overflow: 'hidden',
                position: 'relative',
            }}>
            <Loading open isCover />
        </Box >
    }

    if (times % 2 === 0) {
        return <VideoIframeContent
            lesson={lesson}
            process={process}
            style={style}
            dataNoteOpen={dataNoteOpen}
            setDataNoteOpen={setDataNoteOpen}
        />
    }

    return <Box>
        <VideoIframeContent
            lesson={lesson}
            process={process}
            style={style}
            dataNoteOpen={dataNoteOpen}
            setDataNoteOpen={setDataNoteOpen}
        />
    </Box>

}

export default VideoIframe


function VideoIframeContent({ lesson, process, style, dataNoteOpen, setDataNoteOpen }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    style?: React.CSSProperties,
    dataNoteOpen: {
        anchorEl: null | HTMLButtonElement;
        open: boolean;
        content: CourseNote | null;
        alwayShowNote: boolean;
        time: number;
        isHoverContent: boolean;
        clickAddNoteInVideo?: boolean | undefined;
    },
    setDataNoteOpen: React.Dispatch<React.SetStateAction<{
        anchorEl: null | HTMLButtonElement;
        open: boolean;
        content: CourseNote | null;
        alwayShowNote: boolean;
        time: number;
        isHoverContent: boolean;
        clickAddNoteInVideo?: boolean | undefined;
    }>>
}) {

    const classes = useStyle();

    const logoWatermarkRef = React.useRef<HTMLElement | null>(document.getElementById('uid_video'));

    const timeTracking = React.useRef<{ [key: number]: true }>({});

    const chapterVideoElement = React.useRef<{
        listChapterElement: NodeListOf<HTMLElement>,
        chapterCurrent: string,
        indexChapterCurrent: number,
        chapterTitleInVideo: HTMLElement | null,
    } | null>(null);

    const playerRef = React.useRef<ANY>(null);

    const thumbnailHoverVideo = React.useRef<HTMLElement | null>(null);

    const isUpdateComplete = React.useRef<boolean>(false);

    const [chapterVideo, setChapterVideo] = React.useState<IChapterVideo[] | undefined>(undefined);

    const [notes, setNotes] = React.useState<null | CourseNote[]>(null);

    // const isFocusout = useWindowFocusout();

    const isLoadVideo = React.useRef(false);

    const user = useSelector((state: RootState) => state.user);

    const dispath = useDispatch();

    const navigate = useNavigate();

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    const checkLogoWatermark = () => {
        if (!logoWatermarkRef.current || !checkHasUElementLogo(logoWatermarkRef.current, user)) {
            if (window.__hls) {
                navigate('/');
                window.__hls.player.dispose();
                delete window.__hls;
                dispath(logout());
            }
            return false;
        }
        return true;
    }

    React.useEffect(() => {

        window.__videoTimeCurrent = 0;

        if (process && lesson.id && window.__loaded_video !== lesson.id) {
            window.__loaded_video = lesson.id;
            addScript('/js/video.min.js', 'video.js', () => {

                // addScript('https://unpkg.com/@videojs/http-streaming@2.14.0/dist/videojs-http-streaming.min.js', 'hls', () => {

                if (lesson.video) {
                    if (process.content) {

                        let player = window.videojs('videoCourse_livevideo_' + lesson.id, {
                            controlBar: {},
                            controls: true,
                            playbackRates: [0.5, 1, 1.5, 2],
                        });

                        player.poster(getImageUrl(lesson.video_poster ?? '/images/video-thumbnail.jpg', '/images/video-thumbnail.jpg'));

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
                            player: player
                        };

                        playerRef.current = player;

                        player.on('timeupdate', function () {
                            if (!checkLogoWatermark()) {
                                return;
                            }
                            const videoTimeCurrent = document.querySelector('#videoTimeCurrent .MuiChip-label') as HTMLSpanElement;

                            window.__videoTimeCurrent = player.currentTime();

                            if (videoTimeCurrent) {
                                videoTimeCurrent.innerText = convertHMS(window.__videoTimeCurrent ?? 0) ?? '00:00';
                            }
                            timeTracking.current[window.__videoTimeCurrent] = true;

                            if (chapterVideoElement.current) {
                                let indexElement = -1;
                                for (let i = 0; i < chapterVideoElement.current.listChapterElement.length; i++) {
                                    //@ts-ignore
                                    if (Number(chapterVideoElement.current.listChapterElement[i].dataset.time) <= window.__videoTimeCurrent) {
                                        indexElement = i;
                                    }
                                    chapterVideoElement.current.listChapterElement[i].classList.remove('active');
                                }

                                if (indexElement > -1) {
                                    chapterVideoElement.current.listChapterElement[indexElement].classList.add('active');

                                    if (chapterVideoElement.current.chapterTitleInVideo !== null
                                        && chapterVideoElement.current.chapterCurrent !== chapterVideoElement.current.listChapterElement[indexElement].dataset.title) {
                                        chapterVideoElement.current.chapterTitleInVideo.innerHTML = chapterVideoElement.current.listChapterElement[indexElement].dataset.title + '&nbsp;<svg style="width: 16px;height: 16px;" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="ArrowForwardIosRoundedIcon"><path d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31c.39-.39.39-1.02 0-1.41L9.15 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"></path></svg>';
                                    }
                                }
                            }
                        });

                        player.on('ended', function () {
                            courseLearningContext.nexLesson();
                            // loadTimeTracking();
                        });

                        player.on('firstplay', function () {
                            window.__playFirstInteract = true;
                            checkLogoWatermark();
                        });

                        player.on('canplaythrough', function () {
                            // console.log(123123);
                        });

                        player.on('play', function () {
                            loadNotesToVideo();
                        });

                        player.on('pause', function () {
                            loadTimeTracking();
                        });

                        if (lesson.playerStoryboardSpecRenderer) {
                            const processHolder = document.getElementsByClassName('vjs-progress-holder')[0] as HTMLElement | null;
                            const timeTooltip = document.querySelector('.vjs-progress-control .vjs-mouse-display') as HTMLElement | null;

                            if (processHolder && timeTooltip) {

                                processHolder.addEventListener('mousemove', function () {
                                    const width = processHolder.offsetWidth;
                                    if (lesson.time && timeTooltip && lesson.playerStoryboardSpecRenderer?.total) {
                                        if (thumbnailHoverVideo.current) {
                                            const positionLeft = Number(timeTooltip.style.left.replace('px', ''));
                                            let left = 0;

                                            if ((width - positionLeft) < 80) {
                                                left = width - 80;
                                            } else {
                                                if (positionLeft < 80) {
                                                    left = 80;
                                                }
                                            }
                                            thumbnailHoverVideo.current.style.left = left !== 0 ? (left + 'px') : positionLeft + 'px';

                                            const time = parseInt(positionLeft * window.__videoTime[lesson.id] / width + '');
                                            const indexImage = Math.round(time * (lesson.playerStoryboardSpecRenderer?.total ?? 1) / (Number(lesson.time) ?? 1));

                                            const screen1 = Math.floor(indexImage / 100)
                                            const index1 = indexImage % 100;

                                            const screen2 = Math.floor(indexImage / 25)
                                            const index2 = indexImage % 25;



                                            let chapterCurrent = chapterVideo?.find(item => item.start_time_int <= time && (item.end_time_int === null || item.end_time_int >= time));

                                            let chapterTitle: string | null = null;
                                            if (chapterCurrent) {
                                                chapterTitle = (chapterCurrent.index + 1 + '').padStart(2, '0') + '. ' + chapterCurrent.title;
                                            }
                                            thumbnailHoverVideo.current.innerHTML = '<div class="mourse_thumbnail" style="margin-top:' + (chapterTitle ? '0px' : '30px') + ';background-image: url(' + lesson.playerStoryboardSpecRenderer?.url2.replace('##', screen2 + '') + '), url(' + lesson.playerStoryboardSpecRenderer?.url1.replace('##', screen1 + '') + ');background-position: -' + (index2 % 5 * 160) + 'px -' + (Math.floor(index2 / 5) * 90) + 'px, -' + (index1 % 10 * 160) + 'px -' + (Math.floor(index1 / 10) * 90) + 'px;" ></div>' + (chapterTitle ? '<span class="chapter_title ' + (left !== 0 ? left === 80 ? 'pLeft' : 'pRight' : '') + '">' + chapterTitle + '</span>' : '');
                                        }
                                    }
                                });
                            }
                        }


                        document.getElementsByClassName('vjs-big-play-button')[0]?.addEventListener('click', function () {
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

                        document.getElementById('player_video_youtube_' + lesson.id)?.addEventListener('dblclick', function () {
                            if (player.isFullscreen()) {
                                player.exitFullscreen();
                            } else {
                                player.requestFullscreen();
                            }
                        });

                        player.on('ready', function () {

                            if (!checkLogoWatermark()) {
                                return;
                            }

                            // loadNotesToVideo();

                            // (async () => {
                            //     while (Number.isNaN(player.duration())) {
                            //         await new Promise((resolve) => {
                            //             setTimeout(() => {
                            //                 resolve(10);
                            //             }, 10);
                            //         });
                            //     }


                            //     if (!window.__videoTime) window.__videoTime = {};

                            //     if (!window.__videoTime[lesson.id]) {
                            //         window.__videoTime[lesson.id] = player.duration();
                            //         loadNotesToVideo();
                            //     }

                            // })();


                            window.changeVideoTime = (time: number) => {
                                player.currentTime(time);
                                if (player && player.play) {
                                    player.play();
                                }
                            }

                            window.changeVideoTime((window.__hlsTime?.[lesson.code] ?? 0) as number)

                            window.__videoTimeCurrent = player.currentTime();

                            delete window.__hlsTime;

                            const main = document.querySelector('#popupLearning');
                            if (main) {
                                main.closest('.custom_scroll')?.scrollTo({ behavior: 'smooth', top: 0 });
                            }

                            // let isPlaying = player.currentTime > 0 && !player.paused() && !player.ended()
                            //     && player.readyState();

                            // if (!isPlaying && window.__playFirstInteract) {
                            //     setTimeout(() => {
                            //         if (player && player.play) {
                            //             player.play();
                            //         }
                            //     }, 1000);
                            // }

                        });

                        if (!isLoadVideo.current) {
                            isLoadVideo.current = true;

                            const buttonsCustom = window.__hls.player.getChild('ControlBar').el().querySelectorAll('.custom-button');

                            for (let index = 0; index < buttonsCustom.length; index++) {
                                buttonsCustom[index].remove();
                            }

                            player.getChild('ControlBar').el().querySelector('.vjs-progress-control .vjs-progress-holder')?.addEventListener('dblclick', function () {
                                // let video: HTMLVideoElement = document.getElementById('videoCourse_livevideo_youtube_youtube_api') as HTMLVideoElement;
                                // if (video) {

                                player.pause();
                                //@ts-ignore
                                const element = player.getChild('ControlBar').el().querySelector('.vjs-progress-control .vjs-progress-holder .vjs-mouse-display');

                                const clone: HTMLButtonElement = element.cloneNode();

                                const parent = element.closest('.vjs-progress-holder');

                                parent.querySelectorAll('.vjs-mouse-display-temp').forEach((element: HTMLButtonElement) => {
                                    element.remove();
                                });

                                clone.style.position = 'absolute';
                                clone.classList.remove('vjs-mouse-display');
                                clone.classList.add('vjs-mouse-display-temp');

                                parent.appendChild(clone);

                                setDataNoteOpen(prev => ({
                                    anchorEl: clone,
                                    alwayShowNote: true,
                                    content: {
                                        content: '',
                                        created_at: '',
                                        chapter_detail: '',
                                        id: 0,
                                        lesson_detail: '',
                                        time: player.currentTime(),
                                        type_note: 'info',
                                    },
                                    isHoverContent: false,
                                    open: true,
                                    time: ++prev.time,
                                }));
                                // }
                            });

                            addButtonToVideoEl(
                                player,
                                'Tua lại 10 giây',
                                () => {
                                    // let video: HTMLVideoElement = document.getElementById('videoCourse_livevideo_youtube_youtube_api') as HTMLVideoElement;
                                    // if (video) {
                                    window.__hls.player.currentTime(window.__hls.player.currentTime() - 10 > 0 ? window.__hls.player.currentTime() - 10 : 0);
                                    window.__hls.player.play();
                                    // }
                                },
                                '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="Replay10Icon"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path><path d="M10.89 16h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.11-.32.04-.29.04-.48v-.97z"></path></svg>',
                                2,
                                'Tua lại 10 giây'
                            );


                            addButtonToVideoEl(
                                player,
                                'Tua tới 10 giây',
                                () => {
                                    window.__hls.player.currentTime(window.__hls.player.currentTime() + 10);
                                    window.__hls.player.play();
                                },
                                '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="Forward10Icon" tabindex="-1" title="Forward10"><path d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2z"></path><path d="M10.86 15.94v-4.27h-.09L9 12.3v.69l1.01-.31v3.26zm1.39-2.5v.74c0 1.9 1.31 1.82 1.44 1.82.14 0 1.44.09 1.44-1.82v-.74c0-1.9-1.31-1.82-1.44-1.82-.14 0-1.44-.09-1.44 1.82zm2.04-.12v.97c0 .77-.21 1.03-.59 1.03s-.6-.26-.6-1.03v-.97c0-.75.22-1.01.59-1.01.38-.01.6.26.6 1.01z"></path></svg>',
                                3,
                                'Tua tới 10 giây'
                            );

                            addButtonToVideoEl(
                                player,
                                'Thêm ghi chú',
                                (expandedButtonEl) => {

                                    player.pause();
                                    //@ts-ignore
                                    setDataNoteOpen(prev => ({
                                        anchorEl: expandedButtonEl,
                                        alwayShowNote: true,
                                        content: {
                                            content: '',
                                            created_at: '',
                                            chapter_detail: '',
                                            id: 0,
                                            lesson_detail: '',
                                            time: player.currentTime(),
                                            type_note: 'info',
                                        },
                                        isHoverContent: false,
                                        open: !prev.open,
                                        clickAddNoteInVideo: true,
                                        time: ++prev.time,
                                    }));

                                    // let video: HTMLVideoElement = document.getElementById('videoCourse_livevideo_youtube_youtube_api') as HTMLVideoElement;
                                    // if (video) {
                                    //     video.pause();
                                    // }

                                    // urlParam.changeQuery({
                                    //     tab_course_learn: 'notes',
                                    // });
                                    // setTimeout(() => {
                                    //     document.querySelector('.section-course-tab')?.scrollIntoView({
                                    //         behavior: 'smooth'
                                    //     });
                                    // }, 100);
                                },
                                '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="NoteAltOutlinedIcon"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z"></path><path d="m15.08 11.03-2.12-2.12L7 14.86V17h2.1zm1.77-1.76c.2-.2.2-.51 0-.71l-1.41-1.41c-.2-.2-.51-.2-.71 0l-1.06 1.06 2.12 2.12 1.06-1.06z"></path></svg>',
                                4,
                                'Thêm ghi chú', undefined, undefined, undefined, 'add_note_inline_video'
                            );

                            if (lesson.chapter_video?.length && chapterVideoElement.current) {
                                chapterVideoElement.current.chapterTitleInVideo = addButtonToVideoEl(
                                    player,
                                    'Đoạn video',
                                    (expandedButtonEl) => {
                                        if (expandedButtonEl) {
                                            courseLearningContext.toggleOpenVideoChapter();
                                        }
                                    },
                                    '',
                                    8,
                                    'Xem chương', undefined, undefined, undefined, 'chapter_video'
                                );
                            }


                            addButtonToVideoEl(
                                player,
                                'Toggle Theater mode',
                                courseLearningContext.LessonList.onToggle,
                                '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SettingsEthernetIcon"><path d="M7.77 6.76 6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"></path></svg>',
                                null,
                                'Toggle Theater mode',
                                'left:-40px;',
                                true
                            );

                            const myButton = playerRef.current.getChild('ControlBar').getChild('ProgressControl').getChild('SeekBar').addChild('button');

                            const button = myButton.el();

                            button.id = 'thumbnail_hover_video';

                            thumbnailHoverVideo.current = button;

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
                                        }
                                    }
                                },
                                `<div style="white-space: nowrap;display: flex;align-items: center;gap:3px;"><label class="switch" style="pointer-events: none;">
                                <input type="checkbox" ${getAutolayNextLesson() ? 'checked' : ''}>
                                <span class="slider round"></span>
                            </label> <span style="color:white;" class="MuiTypography-root MuiTypography-body1 css-13w2yk1-MuiTypography-root">Tự động chuyển bài</span></div>`,
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

            }, 10, 10, () => {
                if (window.videojs) return true;
                return false;
            });
        }
    }, [process]);

    React.useEffect(() => {


        let chapterTemp = lesson.chapter_video;

        if (chapterTemp) {

            let chapterVideoState: IChapterVideo[] = [];

            chapterTemp.forEach((item, index) => {
                chapterVideoState.push({
                    title: item.title,
                    start_time: item.start_time,
                    start_time_int: convertTimeStrToTimeInt(item.start_time),
                    end_time_int: index < ((chapterTemp as []).length - 1) ? convertTimeStrToTimeInt((chapterTemp as IChapterVideo[])[index + 1]?.start_time) - 1 : null,
                    index: index,
                });
            });
            setChapterVideo(chapterVideoState);
        }

        setDataNoteOpen({
            anchorEl: null,
            open: false,
            content: null,
            alwayShowNote: false,
            isHoverContent: false,
            time: 0,
        });

        if (courseLearningContext.chapterVideoRef.current) {
            chapterVideoElement.current = {
                chapterCurrent: '',
                indexChapterCurrent: -1,
                chapterTitleInVideo: null,
                listChapterElement: courseLearningContext.chapterVideoRef.current.querySelectorAll('.chapterVideoItem'),
            };
        } else {
            chapterVideoElement.current = null;
        }

        (async () => {
            setNotes(await courseService.course.getVideoNote(lesson.id));
        })();

        return () => {
            loadTimeTracking();
            delete window.__loaded_video;
            delete window.changeVideoTime;
            if (window.__hls) {
                window.__hls.player.dispose();
                delete window.__hls;
            }
        };
    }, []);

    React.useEffect(() => {
        if (notes !== null) {
            loadNotesToVideo();
        }
    }, [notes]);

    const loadTimeTracking = () => {
        if (window.videojs && playerRef.current) {

            let totalTime = Number(lesson.time);

            if (window.__videoTime && window.__videoTime[lesson.id]) {
                totalTime = window.__videoTime[lesson.id];
            }

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
                if (!courseLearningContext.dataForCourseCurrent?.lesson_completed?.[lesson.id] && !isUpdateComplete.current) {
                    isUpdateComplete.current = true;
                    courseLearningContext.handleClickInputCheckBoxLesson(lesson);
                }
                return true;
            }
            return false;
        }
    };

    const loadNotesToVideo = async () => {

        while (!playerRef.current || (playerRef.current.readyState() !== 4 && playerRef.current.readyState() !== 1)) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(10);
                }, 100);
            });
        }

        if (window.videojs && playerRef.current) {

            setNotes(prev => {

                (async () => {
                    const notesVideo = prev;

                    const buttons = playerRef.current.getChild('ControlBar').getChild('ProgressControl').el().querySelectorAll('.vjs-video-note');

                    for (let index = 0; index < buttons.length; index++) {
                        buttons[index].remove();
                    }

                    if (!window.__videoTime) window.__videoTime = {};

                    while (window.__videoTime?.[lesson.id] === undefined) {

                        if (playerRef.current.duration()) {
                            window.__videoTime[lesson.id] = await playerRef.current.duration();
                        }

                        await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(10);
                            }, 100);
                        });
                    }

                    if (notesVideo) {

                        if (lesson.video_notes) {
                            for (let index = 0; index < lesson.video_notes.length; index++) {
                                const element = lesson.video_notes[index];
                                element.type_note = 'of-the-lecturer';
                                notesVideo.push(element);
                            }
                        }

                        let totalTime = Number(lesson.time);

                        if (window.__videoTime && window.__videoTime[lesson.id]) {
                            totalTime = window.__videoTime[lesson.id];
                        }

                        for (let index = 0; index < notesVideo.length; index++) {
                            const element = notesVideo[index];

                            const myButton = playerRef.current.getChild('ControlBar').getChild('ProgressControl').getChild('SeekBar').addChild('button');

                            const button = myButton.el();

                            button.dataset.time = element.time;

                            button.style.position = 'absolute';
                            button.style.left = Number((Number(element.time) * 100) / totalTime).toFixed(5) + '%';
                            button.style.marginLeft = '-16px';
                            button.style.zIndex = 999 + index;

                            button.classList.add('vjs-video-note');
                            button.classList.add('tooltip-video');
                            // button.querySelector('.vjs-icon-placeholder').innerHTML = decodeURIComponent('\ud83d\ude2c');

                            if (element.type_note) {
                                button.classList.add('type-' + element.type_note);
                            }

                            button.addEventListener('mouseenter', () => {
                                setDataNoteOpen(prev => {

                                    if (!prev.alwayShowNote) {
                                        return {
                                            ...prev,
                                            alwayShowNote: false,
                                            anchorEl: button,
                                            content: element,
                                            open: true,
                                            isHoverContent: false,
                                        };
                                    }
                                    return prev;
                                });
                            });
                            button.addEventListener('mouseleave', () => {
                                // setTimeout(() => {
                                setDataNoteOpen(prev => {
                                    if (!prev.isHoverContent) {
                                        if (!prev.alwayShowNote) {
                                            return {
                                                ...prev,
                                                open: false,
                                                isHoverContent: false,
                                            };
                                        }
                                    }
                                    return prev;
                                });
                                // }, 100);
                            });

                            // if (element.type_note !== 'of-the-lecturer') {
                            button.addEventListener('click', () => {
                                playerRef.current.pause();
                                setDataNoteOpen(prev => ({
                                    alwayShowNote: true,
                                    anchorEl: button,
                                    content: element,
                                    open: true,
                                    isHoverContent: false,
                                    time: ++prev.time,
                                }));
                            });
                        }
                    }
                })();
                return prev;
            })
        }
    }

    // React.useEffect(() => {
    //     if (isFocusout) {
    //         window.__hls?.player.pause();
    //     }
    // }, [isFocusout]);

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
                    ...style,
                    position: 'absolute',
                    height: '100%',
                }}
                controls
                id={'videoCourse_livevideo_' + lesson.id}
                poster={getImageUrl(lesson.video_poster ?? '/images/video-thumbnail.jpg', '/images/video-thumbnail.jpg')}
            >
                Your browser does not support HTML video.
            </video>
            <ShowNoteItem
                lesson={lesson}
                dataNoteOpen={dataNoteOpen}
                setDataNoteOpen={setDataNoteOpen}
                setNotes={setNotes}
            />
        </Box>
    )
}

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
            padding: 16,
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
        }
    }
}));