import { ImageProps } from 'components/atoms/Avatar';
import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';

const getStudents = async (
    courseID: ID | null,
    paginate: { current_page: number, per_page: number },
    filter: { serach: string, unread: boolean, noAnswer: boolean, noMyAnser: boolean },
    time: {
        startDate: string,
        endDate: string,
    }
): Promise<PaginationProps<StudentProps> | null> => {
    let api = await ajax<{
        students: PaginationProps<StudentProps> | null,
    }>({
        url: 'vn4-e-learning/instructor/performance/students/get',
        data: {
            course_id: courseID,
            page: paginate.current_page,
            length: paginate.per_page,
            ...filter,
            time: time,
        }
    });

    return api.students;
}

export default getStudents

export interface StudentProps {
    id: ID,
    full_name: string,
    slug: string,
    avatar: ImageProps,
    created_at: string,
    course: {
        id: ID,
        title: string,
        featured_image: string,
    },
    process: {
        precent: number
    }
}