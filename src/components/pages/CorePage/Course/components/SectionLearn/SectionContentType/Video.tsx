import NoticeContent from 'components/molecules/NoticeContent'
import { __ } from 'helpers/i18n'
import React from 'react'
import { CourseLessonProps, ProcessLearning } from 'services/courseService'
import VideoIframe from './VideoIframe'
import Youtube from './Youtube'

function Video({ lesson, process, style }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    style?: React.CSSProperties
}) {

    if (lesson.video !== '[]') {
        return (
            <VideoIframe
                lesson={lesson}
                process={process}
                style={style}
            />
        )
    }

    if (lesson.youtube_id) {
        return <Youtube
            lesson={lesson}
            process={process}
            style={style}
        />
    }

    return <NoticeContent
        title={__('Nội dung đang cập nhật')}
        description=''
        image='/images/undraw_no_data_qbuo.svg'
        disableButtonHome
    />

}

export default Video