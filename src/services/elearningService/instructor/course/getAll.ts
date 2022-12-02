import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';
import { CourseProps } from 'services/courseService';

const getAll = (): Promise<CourseProps[] | null> => {
    return cacheWindow('vn4-e-learning/instructor/course/get', async () => {
        let api = await ajax<{
            courses: CourseProps[] | null,
        }>({
            url: 'vn4-e-learning/instructor/course/get',
        });

        return api.courses;
    });
}

export default getAll