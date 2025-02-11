import React from "react";
import FormCreateCourse from "../components/FormCreateCourse";
import courseService, { CourseProps } from "services/courseService";
import { useNavigate } from "react-router-dom";

export default function CreateCourseSlug({ tab }: { tab: string }) {

    const [course, setCourse] = React.useState<CourseProps | null>(null);
    const navigate = useNavigate();

    const onloadCourse = async () => {
        let course = await courseService.me.course.getMyCourse(tab);

        if (course) {
            setCourse(course);
            return;
        }
        navigate('/create-course');
    }
    React.useEffect(() => {
        onloadCourse();
    }, [tab]);

    return <FormCreateCourse course={course} onloadCourse={onloadCourse} />
}