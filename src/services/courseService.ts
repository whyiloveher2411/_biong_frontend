import { PaginationProps } from 'components/atoms/TablePagination';
import { ImageObjectProps } from 'helpers/image';
import { ajax } from 'hook/useApi';
import { CommentProps } from './commentService';

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

        data.products.forEach((item: CourseProps) => {
            parseContent(item);
        });

        return data.products;

        // return courses;
    },
    find: async (slug: string): Promise<CourseProps | null> => {

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
    },

    config: async (): Promise<{
        type: JsonFormat
    } | null> => {

        let data = await ajax<{
            type: JsonFormat
        } | null>({
            url: '/vn4-e-learning/course/config',
        });

        return data;
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

    noteEdit: async (note: CourseNote, content: string): Promise<boolean> => {

        let data = await ajax<{
            result: boolean
        }>({
            url: 'vn4-e-learning/note/edit',
            data: {
                note_id: note.id,
                content: content
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

            data.notes.data.forEach(item => {
                item.chapter = JSON.parse(item.chapter_detail);
                item.lesson = JSON.parse(item.lesson_detail);
            });

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

    toggleLessonCompleted: async (lesson: LessonCompletedData): Promise<number> => {
        return (await ajax<{
            result: boolean,
            completion_rate: number,
        }>({
            url: 'vn4-e-learning/completed-lectures',
            data: {
                ...lesson
            }
        })).completion_rate;
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

    getComments: async ({ per_page, current_page, postID, type, parent }: { current_page: number, per_page: number, postID: ID, type: string, parent?: ID }): Promise<PaginationProps<CommentProps> | null> => {

        let post = await ajax<{
            comments: PaginationProps<CommentProps>
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
            post.comments.data.forEach(item => {
                try {
                    item.reaction_summary = JSON.parse(item.vn4_reaction_summary);
                } catch (error) {
                    item.reaction_summary = [];
                }

                try {
                    item.vote_summary = JSON.parse(item.vn4_vote_summary);
                } catch (error) {
                    item.vote_summary = [];
                }

            });
            return post.comments;
        }
        return null;
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
}

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
    page: number
}

interface UploadNewNoteData extends ChapterAndLessonCurrentState {
    course: string,
    chapter_id: ID,
    lesson_id: ID,
    time: number,
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
        total_time: number,
        owner: ID,
        owner_detail?: null | Author,
        content?: null | CourseContent,
        description?: string,
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
        faq: null | Array<{
            question: string,
            answers: string,
        }>,
        changelog: null | Array<{
            title: string,
            time: string,
            content: string,
        }>,
        sumary?: {
            rating: number,
            reviewNumber: number,
            studentNumber: number,
        }
    }
}

export interface Author {
    title: string,
    avatar: string,
    slug: string,
}

export type CourseContent = Array<CourseChapterProps>

export interface ReviewItemProps {
    id: ID,
    customer: Author | null,
    ecom_customer_detail: string,
    rating: 1 | 2 | 3 | 4 | 5,
    detail: string,
    title: string,
    created_at: string,
}

export interface CourseChapterProps {
    id: ID,
    code: string,
    title: string,
    lessons: Array<CourseLessonProps>,
}

export interface CourseLessonProps {
    id: ID,
    code: string,
    title: string,
    time: string,
    type: string,
    is_public: boolean,
    is_compulsory: boolean,
    video?: {
        ext: string,
        link: string,
        type_link: string,
    },
    stt: number,
    resources?: Array<{
        title: string,
        type: 'download' | 'link',
        file_download?: string,
        link?: string,
    }>
}

export interface ProcessLearning {
    result: boolean,
    path: string,
    content: string,
    str: string,
}

export interface FinalyProjectProps {
    title: string,
    description: string,
    featured_image: ImageObjectProps
}

export interface CourseWithReviewProp extends CourseProps {
    my_review?: {
        detail: string,
        id: ID,
        rating: number,
    }
}