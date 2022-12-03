import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
import { CourseNote } from 'services/courseService';

const getNote = async (
    courseID: ID | null,
    paginate: { current_page: number, per_page: number },
    filter: { serach: string, unread: boolean, noAnswer: boolean, noMyAnser: boolean },
    time: {
        startDate: string,
        endDate: string,
    }
): Promise<PaginationProps<CourseNote> | null> => {
    let api = await ajax<{
        notes: PaginationProps<CourseNote> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/note/get',
        data: {
            course_id: courseID,
            page: paginate.current_page,
            length: paginate.per_page,
            ...filter,
            time: time,
        }
    });

    if (api.notes?.data) {
        api.notes.data.forEach(item => {
            try {
                item.chapter = JSON.parse(item.chapter_detail);
            } catch (error) {
                item.chapter = undefined;
            }

            try {
                item.lesson = JSON.parse(item.lesson_detail);
            } catch (error) {
                item.lesson = undefined;
            }
        });
    }

    return api.notes;
}

export default getNote