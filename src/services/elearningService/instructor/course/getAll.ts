import { ajax } from 'hook/useApi';
import { CourseProps } from 'services/courseService';

const getAll = async (): Promise<CourseProps[] | null> => {
    let api = await ajax<{
        courses: CourseProps[] | null,
    }>({
        url: 'vn4-e-learning/instructor/course/get',
    });

    return api.courses;
}

export default getAll