import DrawerCustom from 'components/molecules/DrawerCustom'
import { ChapterAndLessonCurrentState } from 'services/courseService'
import SectionLearning from './SectionLearning'

function SectionLearn({ slug, open, onClose }: {
    slug: string,
    open: boolean,
    onClose: () => void,
}) {

    return <DrawerCustom
        open={open}
        onClose={onClose}
        PaperProps={{
            sx: {
                width: '100%',
            }
        }}
        width="100%"
        deActiveIconClose
        componentChildren={
            <SectionLearning slug={slug} onClose={onClose} />
        }
        transitionDuration={300}
    />
}

export default SectionLearn

export interface LessonPosition extends ChapterAndLessonCurrentState {
    id: ID,
    chapter: string
    chapterIndex: number,
    lesson: string,
    lessonIndex: number,
    stt: number,
}