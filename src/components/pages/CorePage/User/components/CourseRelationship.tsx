import CourseSingle from 'components/molecules/CourseSingle';
import React from 'react';
import courseService, { CourseProps } from 'services/courseService';

function CourseRelationship() {

    const [courses, setCourses] = React.useState<Array<CourseProps> | null>(null)

    React.useEffect(() => {
        (async () => {
            setCourses(await courseService.getCourseRelationship(5));
        })();
    }, []);

    return (
        <>
            {
                courses ?
                    courses.map((course, index) => (
                        <CourseSingle height='unset' key={index} course={course} />
                    ))
                    :
                    [1, 2, 3].map((index) => (
                        <CourseSingle height='unset' key={index} />
                    ))
            }
        </>
    )
}

export default CourseRelationship