import { Roadmap } from './elearningService';
import { UserProps } from './../store/user/user.reducers';
import { PaginationProps } from 'components/atoms/TablePagination';
import { ImageObjectProps } from 'helpers/image';
import { ajax } from 'hook/useApi';
import { CommentProps } from './commentService';
import cacheWindow from 'hook/cacheWindow';
import { __ } from 'helpers/i18n';
import { ImageProps } from 'components/atoms/Avatar';
import { ExploreProps } from './exploreService';

function parseLeturerDetail(item: CourseProps) {
    if (typeof item.course_detail?.owner_detail === 'string') {
        try {
            item.course_detail.owner_detail = JSON.parse(item.course_detail.owner_detail);
        } catch (error) {
            item.course_detail.owner_detail = null;
        }
    }
}

function parseChangelog(item: CourseProps) {
    if (typeof item.course_detail?.changelog === 'string') {
        try {
            item.course_detail.changelog = JSON.parse(item.course_detail.changelog);
        } catch (error) {
            item.course_detail.changelog = null;
        }
    }
}

function parseCourseContent(item: CourseProps) {
    if (typeof item.course_detail?.content === 'string') {
        try {
            item.course_detail.content = JSON.parse(item.course_detail?.content);

            item.course_detail.content?.forEach(item => {
                if (!Array.isArray(item.lessons)) {
                    item.lessons = JSON.parse(item.lessons);
                }
            });
        } catch (error) {
            item.course_detail.content = null;
        }

        if (Array.isArray(item.course_detail.content)) {
            item.course_detail.content = item.course_detail.content.filter(item => !item.delete);

            for (let i = 0; i < item.course_detail.content.length; i++) {

                if (Array.isArray(item.course_detail.content[i].lessons)) {
                    item.course_detail.content[i].lessons = item.course_detail.content[i].lessons.filter(lesson => !lesson.delete);

                    item.course_detail.content[i].lessons.forEach(lesson => {
                        if (typeof lesson.resources === 'string') {
                            try {
                                lesson.resources = JSON.parse(lesson.resources);
                            } catch (error) {
                                lesson.resources = [];
                            }
                        }

                        if (typeof lesson.reference_post === 'string') {
                            try {
                                lesson.reference_post = JSON.parse(lesson.reference_post);
                            } catch (error) {
                                lesson.reference_post = [];
                            }
                        }

                        if (typeof lesson.tests === 'string') {
                            try {
                                lesson.tests = JSON.parse(lesson.tests);
                            } catch (error) {
                                lesson.tests = [];
                            }
                        }
                    })
                }
            }
        }


    }
}

function parseCourseWho(item: CourseProps) {
    if (typeof item.course_detail?.who === 'string') {
        try {
            item.course_detail.who = JSON.parse(item.course_detail?.who);
        } catch (error) {
            item.course_detail.who = null;
        }
    }
}

function parseCourseRequirements(item: CourseProps) {
    if (typeof item.course_detail?.requirements === 'string') {
        try {
            item.course_detail.requirements = JSON.parse(item.course_detail?.requirements);
        } catch (error) {
            item.course_detail.requirements = null;
        }
    }
}

function parseCourseWhatYouWillLearn(item: CourseProps) {
    if (typeof item.course_detail?.what_you_will_learn === 'string') {
        try {
            item.course_detail.what_you_will_learn = JSON.parse(item.course_detail?.what_you_will_learn);
        } catch (error) {
            item.course_detail.what_you_will_learn = null;
        }
    }
}

function parseCourseWhatYouWillReceive(item: CourseProps) {
    if (typeof item.course_detail?.what_you_will_receive === 'string') {
        try {
            item.course_detail.what_you_will_receive = JSON.parse(item.course_detail?.what_you_will_receive);
        } catch (error) {
            item.course_detail.what_you_will_receive = null;
        }
    }
}

function parseCourseTag(item: CourseProps) {
    if (typeof item.ecom_prod_tag === 'string') {
        try {
            item.tags = JSON.parse(item.ecom_prod_tag);
        } catch (error) {
            item.tags = null;
        }
    }
}

function parseCourseFAQ(item: CourseProps) {
    if (typeof item.course_detail?.faq === 'string') {
        try {
            item.course_detail.faq = JSON.parse(item.course_detail.faq);
        } catch (error) {
            item.course_detail.faq = null;
        }
    }
}

function parseProjects(item: CourseProps) {
    if (typeof item.course_detail?.projects === 'string') {
        try {
            item.course_detail.projects = JSON.parse(item.course_detail.projects);

            if (item.course_detail.projects) {
                item.course_detail.projects = item.course_detail.projects.filter(item => !item.delete)
            }
        } catch (error) {
            item.course_detail.projects = null;
        }
    }
}

function parseSkills(item: CourseProps) {
    if (typeof item.course_detail?.skills === 'string') {
        try {
            item.course_detail.skills = JSON.parse(item.course_detail.skills);
        } catch (error) {
            item.course_detail.skills = null;
        }
    }
}


function parseContent(item: CourseProps) {
    parseLeturerDetail(item);
    parseCourseContent(item);
    parseCourseWho(item);
    parseCourseRequirements(item);
    parseCourseWhatYouWillLearn(item);
    parseCourseWhatYouWillReceive(item);
    parseCourseTag(item);
    parseCourseFAQ(item);
    parseChangelog(item);
    parseProjects(item);
    parseSkills(item);
}



const courseService = {
    parseLeturerDetail: (item: CourseProps) => {
        parseLeturerDetail(item);
    },
    parseCourseContent: (item: CourseProps) => {
        parseCourseContent(item);
    },
    parseCourseWho: (item: CourseProps) => {
        parseCourseWho(item);
    },
    parseCourseRequirements: (item: CourseProps) => {
        parseCourseRequirements(item)
    },
    parseCourseWhatYouWillLearn: (item: CourseProps) => {
        parseCourseWhatYouWillLearn(item);
    },
    parseCourseFAQ: (item: CourseProps) => {
        parseCourseFAQ(item);
    },
    parseChangelog: (item: CourseProps) => {
        parseChangelog(item);
    },
    parseContent: (item: CourseProps) => {
        parseContent(item);
    },
    parseProjects: (item: CourseProps) => {
        parseProjects(item);
    },
    parseSkills: (item: CourseProps) => {
        parseSkills(item);
    },

    course: {
        getFeatured: async (): Promise<CourseProps[]> => {
            let data = await ajax<{
                products: CourseProps[]
            }>({
                url: 'vn4-ecommerce/product/get-featured',
            });

            if (data.products) {
                data.products.forEach((item: CourseProps) => {
                    parseContent(item);
                });

                return data.products;
            }

            return [];
            // return courses;
        },

        getVideoNote: async (lesson_id: ID): Promise<CourseNote[]> => {

            let data = await ajax<{
                notes: CourseNote[]
            }>({
                url: '/vn4-e-learning/note/get-note-of-video',
                data: {
                    lesson_id: lesson_id,
                }
            });

            return data.notes;
        },
    },
    getAll: async ({ current_page, per_page }: { current_page: number, per_page: number }): Promise<PaginationProps<CourseProps>> => {

        let data = await ajax<{
            products: PaginationProps<CourseProps>
        }>({
            url: 'vn4-ecommerce/product/get',
            data: {
                length: per_page,
                page: current_page
            }
        });

        data.products.data.forEach((item: CourseProps) => {
            parseContent(item);
        });

        return data.products;

        // return courses;
    },
    getCourseRelationship: async (length: number): Promise<CourseProps[]> => {

        let data = await ajax<{
            products: CourseProps[]
        }>({
            url: 'vn4-ecommerce/product/get-relationship',
            data: {
                length: length,
            }
        });
        if (data.products) {
            data.products.forEach((item: CourseProps) => {
                parseContent(item);
            });
            return data.products;
        }
        return [];

        // return courses;
    },
    find: (slug: string): Promise<CourseProps | null> => {
        return cacheWindow('vn4-ecommerce/product/find/' + slug, async () => {
            let data = await ajax<{
                product: CourseProps
            } | null>({
                url: 'vn4-ecommerce/product/find',
                data: {
                    slug: slug
                }
            });

            if (data?.product) {
                parseContent(data.product);
                return data.product;
            }

            return null;
        });
    },

    config: (): Promise<{
        type: JsonFormat
    } | null> => {

        return cacheWindow('/vn4-e-learning/course/config', async () => {
            let data = await ajax<{
                type: JsonFormat
            } | null>({
                url: '/vn4-e-learning/course/config',
            });

            return data;
        })

    },

    getCoursesOfMe: async (): Promise<CourseProps[]> => {

        let data = await ajax<{
            courses: CourseProps[],
        }>({
            url: 'vn4-e-learning/me/course',
        });

        return data.courses;
    },

    noteDelete: async (chapterAndLessonCurrent: DeleteNoteData, note: CourseNote): Promise<boolean> => {
        let data = await ajax<{
            result: boolean
        }>({
            url: 'vn4-e-learning/note/delete',
            data: {
                ...chapterAndLessonCurrent,
                note_id: note.id
            }
        });

        return data.result;
    },

    notePost: async (chapterAndLessonCurrent: UploadNewNoteData, content: string): Promise<boolean> => {

        let data = await ajax<{
            result: boolean
        }>({
            url: 'vn4-e-learning/note/post',
            data: {
                ...chapterAndLessonCurrent,
                content: content
            }
        });

        return data.result;
    },

    upLearningProcess: async (data: {
        lesson: CourseLessonProps | null,
        chapter: ID,
        course: ID,
        chapter_stt: number,
    }): Promise<ProcessLearning | null> => {
        if (data.lesson) {
            let api = await ajax<ProcessLearning>({
                url: 'vn4-e-learning/learning/process',
                data: data,
            });

            return api;
        }
        return null;
    },

    getLessonPreview: async (lesson: CourseLessonProps | null): Promise<ProcessLearning | null> => {
        if (lesson) {
            let data = await ajax<ProcessLearning>({
                url: 'vn4-e-learning/course/get-preview',
                data: {
                    ...lesson,
                }
            });

            return data;
        }
        return null;
    },

    noteEdit: async (note: CourseNote, content: string, type_note: string): Promise<boolean> => {

        let data = await ajax<{
            result: boolean
        }>({
            url: 'vn4-e-learning/note/edit',
            data: {
                note_id: note.id,
                content: content,
                type_note: type_note,
            }
        });

        return data.result;
    },

    noteGet: async (chapterAndLessonCurrent: LoadNoteData): Promise<PaginationProps<CourseNote> | null> => {
        let data = await ajax<{
            notes: PaginationProps<CourseNote>
        }>({
            url: 'vn4-e-learning/note/get',
            data: {
                ...chapterAndLessonCurrent
            }
        });

        if (data.notes) {
            return data.notes;
        }
        return null;
    },

    getLessonCompleted: async (course_slug: string): Promise<DataForCourseCurrent> => {
        let data = await ajax<DataForCourseCurrent>({
            url: 'vn4-e-learning/get-completed-lectures',
            data: {
                course: course_slug
            }
        });

        return data;
    },

    toggleLessonCompleted: async (lesson: LessonCompletedData): Promise<{
        result: boolean,
        completion_rate: number,
        lesson_completed_count: number,
        lesson_completed: {
            [key: ID]: boolean
        }
    }> => {
        return (await ajax<{
            result: boolean,
            completion_rate: number,
            lesson_completed_count: number,
            lesson_completed: {
                [key: ID]: boolean
            }
        }>({
            url: 'vn4-e-learning/completed-lectures',
            data: {
                ...lesson
            }
        }));
    },
    getCourseSharing: async ({ user, current_page, per_page }: { user: ID, current_page: number, per_page: number }): Promise<PaginationProps<CourseWithReviewProp> | null> => {

        let data = await ajax<{
            products: PaginationProps<CourseWithReviewProp>
        }>({
            url: 'vn4-e-learning/course/get-course-sharing',
            data: {
                length: per_page,
                page: current_page,
                user: user,
            }
        });

        if (data.products) {

            data.products.data.forEach((item: CourseWithReviewProp) => {
                parseContent(item);
            });

            return data.products;
        }
        return null;
        // return courses;
    },
    getCourseOfMe: async ({ user, current_page, per_page }: { user: ID, current_page: number, per_page: number }): Promise<PaginationProps<CourseProps> | null> => {

        let data = await ajax<{
            products: PaginationProps<CourseProps>
        }>({
            url: 'vn4-e-learning/course/get-course-of-me',
            data: {
                length: per_page,
                page: current_page,
                user: user,
            }
        });

        if (data.products) {

            data.products.data.forEach((item: CourseProps) => {
                parseContent(item);
            });

            return data.products;
        }
        return null;
        // return courses;
    },

    getAllLessonCompleted: async (): Promise<{
        [key: ID]: number
    }> => {

        let result = await ajax<{
            data: {
                [key: ID]: number
            }
        }>({
            url: 'vn4-e-learning/get-all-completed-lectures',
        });

        if (result.data) {
            return result.data;
        }
        return {};
    },

    getComments: async ({ per_page, current_page, postID, type }: { current_page: number, per_page: number, postID: ID, type: string }): Promise<PaginationProps<CommentProps> | null> => {

        let post = await ajax<{
            comments: PaginationProps<CommentProps>
        }>({
            url: 'vn4-e-learning/course/comment/get',
            data: {
                length: per_page,
                page: current_page,
                post: postID,
                type: type,
            },
        });

        if (post.comments) {
            return post.comments;
        }
        return null;
    },

    getCommentsChildren: async ({ per_page, current_page, postID, type, parent }: { current_page: number, per_page: number, postID: ID, type: string, parent: ID }): Promise<CommentProps[] | null> => {

        let post = await ajax<{
            comments: CommentProps[]
        }>({
            url: 'vn4-e-learning/course/comment/get',
            data: {
                length: per_page,
                page: current_page,
                post: postID,
                type: type,
                parent: parent,
            },
        });

        if (post.comments) {
            return post.comments;
        }
        return null;
    },

    me: {
        giveaway: {
            getCourseMaybeGiveaway: async ({ per_page, current_page }: { current_page: number, per_page: number }): Promise<{
                courses?: CourseGiveawayProps[],
                giveaway?: PaginationProps<GiveawayItem>
            } | null> => {
                let post = await ajax<{
                    courses?: CourseGiveawayProps[],
                    giveaway?: PaginationProps<GiveawayItem>,
                }>({
                    url: 'vn4-e-learning/me/course-giveaway',
                    data: {
                        length: per_page,
                        page: current_page,
                    }
                });

                if (post.giveaway?.data) {
                    for (let i = 0; i < post.giveaway.data.length; i++) {
                        try {
                            if (typeof post.giveaway.data[i].date_gift === 'string') {
                                post.giveaway.data[i].date_gift_json = JSON.parse(post.giveaway.data[i].date_gift);
                            }
                        } catch (error) {
                            post.giveaway.data[i].date_gift_json = {};
                        }
                    }
                }

                return post;

            },
            postGiveaway: async (email: string, courseID: ID[]): Promise<boolean | null> => {
                let post = await ajax<{
                    result: boolean
                }>({
                    url: 'vn4-e-learning/me/post-giveaway',
                    data: {
                        email: email,
                        course_ids: courseID,
                    }
                });

                if (post.result) {
                    return post.result;
                }

                return null;
            }
        },
        notification: {
            loadFirst: async (): Promise<NotificationProps[] | null> => {
                let post = await ajax<{
                    notifications: NotificationProps[] | null
                }>({
                    url: 'vn4-e-learning/me/notifications/load-notification',
                });

                if (post.notifications) {

                    post.notifications.forEach(item => {

                        try {
                            item.courses_object = JSON.parse(item.courses);
                        } catch (error) {
                            item.courses_object = null;
                        }

                        try {
                            if (typeof item.addin_data === 'string') {
                                item.addin_data = JSON.parse(item.addin_data);
                            }

                            if (!item.addin_data) {
                                item.addin_data = {};
                            }
                        } catch (error) {
                            item.addin_data = {};
                        }

                    })

                    return post.notifications;
                }

                return null;
            },
            get: async (getUnread: boolean, { per_page, current_page }: { current_page: number, per_page: number }): Promise<PaginationProps<NotificationProps> | null> => {
                // return cacheWindow('vn4-e-learning/me/notifications/get-notification', async () => {
                let post = await ajax<{
                    notifications: PaginationProps<NotificationProps>
                }>({
                    url: 'vn4-e-learning/me/notifications/get-notification',
                    data: {
                        length: per_page,
                        page: current_page,
                        get_unread: getUnread,
                    },
                });

                if (post.notifications) {

                    for (let index = 0; index < post.notifications.data.length; index++) {
                        try {
                            post.notifications.data[index].courses_object = JSON.parse(post.notifications.data[index].courses);
                        } catch (error) {
                            post.notifications.data[index].courses_object = null;
                        }

                    }
                    return post.notifications;
                }

                return null;
                // });
            },
            postNotification: async (notification: ID): Promise<number> => {

                let post = await ajax<{
                    notification_unread: number,
                }>({
                    url: 'vn4-e-learning/me/notifications/post-notification',
                    data: {
                        notification: notification,
                    },
                });

                if (post.notification_unread) {
                    return post.notification_unread;
                }

                return 0;
            },
        },
        reaction: {
            getReactionOfCourse: async (courseSlug: string): Promise<{
                answer_test?: { [key: ID]: number },
                reactions: { [key: ID]: '[none]' | 'love' }
            }> => {
                let post = await ajax<{
                    answer_test?: { [key: ID]: number },
                    reactions: { [key: ID]: '[none]' | 'love' }
                }>({
                    url: 'vn4-e-learning/me/get-reaction-of-course',
                    data: {
                        course_slug: courseSlug,
                    }
                });

                return post;
            }
        },
        settingAccount: {
            changeSettingAutoplayNextLesson: async (value: boolean): Promise<boolean | null | number> => {
                let post = await ajax<{
                    auto_next_lesson: boolean | null | number,
                }>({
                    url: 'vn4-e-learning/me/change-setting-autoplay-next-lesson',
                    data: {
                        auto_next_lesson: value,
                    }
                });

                return post.auto_next_lesson;
            },
            changeSettingShowVideoChapter: async (mode: boolean): Promise<boolean> => {
                let data = await ajax<{
                    result: boolean,
                }>({
                    url: 'vn4-account/me/update-show-chapter-video',
                    data: {
                        mode: mode,
                    }
                });

                return data.result;
            }
        },
        test: {
            get: async (testId: ID): Promise<TestProps | null> => {
                let post = await ajax<{
                    test?: TestProps,
                }>({
                    url: 'vn4-e-learning/me/test/get',
                    data: {
                        test: testId,
                    }
                });

                return post.test ? post.test : null;
            },
            post: async (testId: ID, answers: { [key: string]: ANY }): Promise<boolean> => {

                let post = await ajax<{
                    result: boolean,
                }>({
                    url: 'vn4-e-learning/me/test/post',
                    data: {
                        test: testId,
                        answers: answers
                    }
                });

                return post.result;
            }
        }
    }
}

export interface CourseGiveawayProps extends CourseProps {
    number_giveaway: number
}

export interface GiveawayItem {
    title: string,
    course: CourseProps[],
    created_at: string,
    date_gift: string,
    date_gift_json: {
        [key: ID]: string
    },
}

export interface NotificationProps {
    id: ID,
    sender: UserProps | null,
    receiver: UserProps | null,
    notification_type: string,
    message: string,
    addin_data: {
        [key: string]: ANY,
        announcement_type?: string,
        link_redirect?: string,
    },
    created_at: string,
    is_read: number,
    sender_detail: string,
    courses: string,
    courses_object: null | Array<{
        id: ID,
        title: string,
        slug: string,
    }>,
    sender_object?: null | {
        id: ID,
        title: string,
        slug: string,
        avatar: string | ImageProps,
    },
}

export interface CourseNote {
    id: ID,
    time: number | string,
    content: string,
    chapter_detail: string,
    lesson_detail: string,
    chapter?: {
        id: ID,
        title: string,
    },
    lesson?: {
        id: ID,
        title: string
    },
    type_note: keyof NotesType,
    created_at: string,
    account_detail?: string,
    account?: {
        id: ID,
        title: string,
        avatar: ImageProps,
    },
    course?: ID,
}

export const notesTypes = {
    info: __('Thông tin'),
    warning: __('Cảnh báo'),
    error: __('Lỗi'),
    // debug: __('Gỡ lỗi'),
    // qa: __('Hỏi đáp'),
    'of-the-lecturer': __('Của giảng viên')
};

export type NotesType = typeof notesTypes;


export interface ChapterAndLessonCurrentState {
    chapter: string | null,
    lesson: string | null,
    chapterID: ID,
    lessonID: ID,
    chapterIndex: number,
    lessonIndex: number,
}

interface LoadNoteData {
    course: string,
    length: number,
    page: number,
    type: number,
    sort: number,
    lesson_current: ID,
}

interface UploadNewNoteData extends ChapterAndLessonCurrentState {
    course: string,
    chapter_id: ID,
    lesson_id: ID,
    time: number | string,
    type_note: string,
}

interface DeleteNoteData extends ChapterAndLessonCurrentState {
    course: string,
    chapter_id: ID,
    lesson_id: ID,
}

export interface DataForCourseCurrent {
    lesson_completed: {
        [key: ID]: boolean
    },
    lesson_current: ID,
}

interface LessonCompletedData {
    course: ID,
    chapter_id: ID,
    lesson_id: ID,
    lesson_code: string,
    chapterIndex: number,
    lessonIndex: number,
    type: 'auto' | 'end-video'
}

export default courseService;

export interface CourseProps {
    id: string,
    title: string,
    featured_image: string,
    description: string,
    slug: string,
    last_update: string,
    updated_at: string,
    view_count?: number,
    like_count?: number,
    dislike_count?: number,
    share_count?: number,
    student_count?: number,
    review_items?: Array<ReviewItemProps>,
    rating_count?: number,
    rating_avg?: number,
    rating_sumary?: [number, number, number, number, number],
    price: string,
    compare_price: string,
    percent_discount: string,
    ecom_prod_tag: string,
    is_purchased?: boolean,
    user_role?: {
        role: string,
        title: string,
    },
    completion_data?: {
        rate: number,
        label_current?: {
            chapter: {
                id: ID,
                title: string,
                stt: number,
            },
            lesson: {
                id: ID,
                title: string,
                stt: number,
            },
        }
    },
    tags?: null | Array<{
        id: ID,
        title: string,
        slug: string,
    }>,
    course_detail?: {
        banner?: string,
        total_time: number,
        total_chapter: number,
        total_lesson: number,
        is_allow_trial?: number,
        is_comming_soon: boolean,
        color: string,
        thumbnail_color: string,
        owner: ID,
        owner_detail?: null | Author,
        content?: null | CourseContent,
        introduce: string,
        description?: string,
        count_student_fake?: number,
        skills?: null | Array<{
            id: ID,
            title: string,
        }>,
        requirements?: null | Array<{
            content: string
        }>,
        who?: null | Array<{
            content: string
        }>,
        projects?: null | Array<FinalyProjectProps>,
        what_you_will_learn?: null | Array<{
            content: string,
            delete: boolean,
        }>,
        what_you_will_receive?: null | Array<{
            content: string,
            delete: boolean,
        }>,
        faq: null | Array<{
            question: string,
            answers: string,
        }>,
        changelog: null | Array<{
            title: string,
            time: string,
            content: string,
        }>,
        review_avg: string | number,
        sumary?: {
            rating: number,
            reviewNumber: number,
            studentNumber: number,
        },
        roadmaps?: Roadmap[],
    }
}

export interface Author {
    title: string,
    avatar: string,
    slug: string,
    is_verified?: number,
}

export type CourseContent = Array<CourseChapterProps>

export interface ReviewItemProps {
    id: ID,
    customer: Author | null,
    ecom_customer_detail: string,
    rating: 1 | 2 | 3 | 4 | 5,
    detail: string,
    title: string,
    updated_at: string,
    created_at: string,
    ecom_prod: ID,
    review_status: 'pending' | 'approved' | 'not-approved',
    is_incognito: number,
}

export interface CourseChapterProps {
    id: ID,
    code: string,
    title: string,
    lessons: Array<CourseLessonProps>,
    total_time?: number,
    total_lesson?: number,
    delete: number,
}

export interface CourseLessonProps {
    id: ID,
    code: string,
    title: string,
    time: string,
    type: string,
    is_public: boolean,
    is_compulsory: boolean,
    is_allow_trial?: number,
    video?: string | {
        ext: string,
        link: string,
        type_link: string,
    },
    youtube_id?: string,
    playerStoryboardSpecRenderer?: {
        total: number,
        url1: string,
        url2: string,
    },
    chapter_video?: Array<{
        title: string,
        start_time: string,
    }>,
    stt: number,
    resources?: Array<{
        title: string,
        description: string,
        type: 'download' | 'link' | 'notification',
        file_download?: string,
        link?: string,
    }>,
    video_notes?: Array<CourseNote>,
    delete: number,
    video_poster?: string | {
        ext: string,
        link: string,
        type_link: string,
    },
    reference_post?: Array<{
        title: string,
        content_type: string,
        link: string,
        custom_label?: string,
        is_link_internal: number,
    }>,
    tests?: Array<{
        id: string,
        title: string,
    }>,
}

export interface AddinData {
    type: 'courses' | 'roadmaps' | 'tests' | 'video' | 'blogs',
    courses?: CourseProps[],
    roadmaps?: Roadmap[],
    tests?: Array<{
        id: string;
        title: string;
    }>,
    video?: {
        title: string,
        youtube_id: string,
    },
    blogs?: ExploreProps[]
}

export interface ProcessLearning {
    lesson: ID,
    result: boolean,
    path: string,
    content: string,
    addin_data?: Array<AddinData>,
    str: string,
    precent: number,
    lesson_completed_count: number,
}

export interface FinalyProjectProps {
    title: string,
    description: string,
    link: string,
    featured_image: ImageObjectProps,
    delete: number,
}

export interface CourseWithReviewProp extends CourseProps {
    my_review?: {
        detail: string,
        id: ID,
        rating: number,
    }
}

export interface TestProps {
    id: ID,
    title: string,
    my_answer?: {
        [key: string]: string[]
    },
    content: Array<QuestionTestProps>
}

export interface QuestionTestProps {
    type: 'quiz' | 'fill_in_the_blanks',
    question: string,
    code: string,
    answers: Array<{
        title: string,
        code: string,
        is_answer: 0 | 1,
        explain: string,
    }>,
    content: string,
    answer_option: Array<{
        options: Array<{
            title: string,
            is_answer: number,
        }>
    }>
}