import React from 'react'
import { CourseProps } from 'services/courseService';
import elearningService from 'services/elearningService';

function useCourse() {

    const [courses, setCourses] = React.useState<CourseProps[] | null>(null);

    React.useEffect(() => {
        (async () => {
            const coursesData = await elearningService.instructor.course.getAll();
            setCourses(coursesData);
        })();
    }, []);

    return { courses, setCourses };
}

export default useCourse