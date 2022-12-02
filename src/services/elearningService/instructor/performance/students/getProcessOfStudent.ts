import { ImageProps } from 'components/atoms/Avatar';
import { ajax } from 'hook/useApi';

const getProcessOfStudent = async (
    studentID: ID,
): Promise<ProcessComplete[] | null> => {
    let api = await ajax<{
        process: ProcessComplete[] | null,
    }>({
        url: 'vn4-e-learning/instructor/performance/students/get-process',
        data: {
            student: studentID,
        }
    });

    if (api.process) {

        api.process.forEach(item => {
            if (item.process) {
                try {
                    item.process.label_current_parse = JSON.parse(item.process.label_current);
                } catch (error) {
                    item.process.label_current_parse = undefined;
                }

                try {
                    item.process.lesson_completed_parse = JSON.parse(item.process.lesson_completed);
                } catch (error) {
                    item.process.lesson_completed_parse = undefined;
                }
            }
        })
        return api.process;
    }

    return null;
}

export default getProcessOfStudent

export interface ProcessComplete {
    id: ID,
    title: string,
    featured_image: ImageProps,
    love?: { [key: ID]: 'love' | '[none]' },
    content: Array<{
        delete: number,
        id: ID,
        title: string,
        lessons: Array<{
            delete: number,
            id: ID,
            title: string,
        }>
    }>,
    process?: {
        id: ID,
        label_current: string,
        lesson_completed: string,
        label_current_parse?: {
            chapter: {
                id: ID,
                title: string,
            },
            lesson: {
                id: ID,
                title: string,
            }
        },
        lesson_completed_parse?: { [key: ID]: 1 }
    }
}