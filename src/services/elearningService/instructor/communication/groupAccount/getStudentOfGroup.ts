import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
import { StudentProps } from '../../performance/students/getStudents';

const getStudentOfGroup = async (
    group: ID | null,
    paginate: { current_page: number, per_page: number },
): Promise<PaginationProps<StudentProps> | null> => {
    let api = await ajax<{
        students: PaginationProps<StudentProps> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/group-account/get-student-of-group',
        data: {
            group: group,
            page: paginate.current_page,
            length: paginate.per_page,
        }
    });

    return api.students;
}

export default getStudentOfGroup