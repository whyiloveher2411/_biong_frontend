import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
import { UserProps } from 'store/user/user.reducers';

const getAnnouncements = async (
    courseID: ID | null,
    paginate: { current_page: number, per_page: number },
    filter: { serach: string, unread: boolean, noAnswer: boolean, noMyAnser: boolean },
    time: {
        startDate: string,
        endDate: string,
    }
): Promise<PaginationProps<Announcement> | null> => {
    let api = await ajax<{
        announcements: PaginationProps<Announcement> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/announcements/get',
        data: {
            course_id: courseID,
            page: paginate.current_page,
            length: paginate.per_page,
            ...filter,
            time: time,
        }
    });

    return api.announcements;
}

export default getAnnouncements

export interface Announcement {
    id: ID,
    title: string,
    message: string,
    sender?: UserProps,
    account_count: number,
    notification_count: number,
    is_important: number,
    created_at: string,
    status_current: 'new' | 'progress' | 'done',
    announcement_type: string,
    link_redirect: string,
    send_student_course?: string,
    group_account?: string,
}