import { PaginationProps } from 'components/atoms/TablePagination';
import { ImageObjectProps } from 'helpers/image';
import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';
import { UserProps } from 'store/user/user.reducers';
import { CourseLessonProps, CourseProps, ProcessLearning } from './courseService';
import { ProjectProp } from './elearningService/@type';
import getFreeTutorialCategories from './elearningService/freeTutorial/getFreeTutorialCategories';
import getFreeTutorialCategory from './elearningService/freeTutorial/getFreeTutorialCategory';
import getFreeTutorialContent from './elearningService/freeTutorial/getFreeTutorialContent';
import addNewAnnouncement from './elearningService/instructor/communication/announcements/addNewAnnouncement';
import createNotification from './elearningService/instructor/communication/announcements/createNotification';
import getAnnouncements from './elearningService/instructor/communication/announcements/getAnnouncements';
import addNewGroupAccount from './elearningService/instructor/communication/groupAccount/addNewGroupAccount';
import getGroupAccount from './elearningService/instructor/communication/groupAccount/getGroupAccount';
import getStudentOfGroup from './elearningService/instructor/communication/groupAccount/getStudentOfGroup';
import getNote from './elearningService/instructor/communication/note/getNote';
import getQa from './elearningService/instructor/communication/qa/get';
import updateReaded from './elearningService/instructor/communication/qa/updateReaded';
import getAll from './elearningService/instructor/course/getAll';
import getReview from './elearningService/instructor/performance/reviews/getReview';
import updateStatusReview from './elearningService/instructor/performance/reviews/updateStatusReview';
import addAccountToGroup from './elearningService/instructor/performance/students/addAccountToGroup';
import getProcessOfStudent from './elearningService/instructor/performance/students/getProcessOfStudent';
import getStudents from './elearningService/instructor/performance/students/getStudents';
import getPageContent from './elearningService/page/getPageContent';
import getPagesOfGroup from './elearningService/page/getPagesOfGroup';
import getQuestionAndAnswer from './elearningService/qa/getQuestionAndAnswer';
import getQuestionDetail from './elearningService/qa/getQuestionDetail';
import postQuestion from './elearningService/qa/postQuestion';
import cv from './elearningService/user/cv';

export const REPORT_TYPE = 'vn4_report_course';
export const COMMENT_TYPE = 'vn4_comment_course_qa';
export const REACTION_COURSE_COMMENT_TYPE = 'vn4_comment_course_qa_reaction';
export const QA_VOTE_TYPE = 'vn4_comment_course_qa_vote';

export const REPORT_REVIEW_TYPE = 'vn4_report_review';

const elearningService = {

    getCourseOfMe: async (): Promise<CourseProps[]> => {

        let data = await ajax<CourseProps[]>({
            url: 'vn4-e-learning/me/course',
        });

        return data;
    },

    getProfileNotifications: async (): Promise<{
        fields: {
            [key: string]: ProfileNotificationsProps
        },
        values: {
            [key: string]: boolean
        }
    }> => {
        let result = await ajax<{
            data: {
                fields: {
                    [key: string]: ProfileNotificationsProps
                },
                values: {
                    [key: string]: boolean
                }
            }
        }>({
            url: 'vn4-e-learning/me/notifications',
        });

        return result.data;
    },


    postProfileNotifications: async (key: string, checked: boolean) => {

        await ajax<{
            result: boolean
        }>({
            url: 'vn4-e-learning/me/notifications/post',
            data: {
                key: key,
                checked: checked,
            }
        });
    },

    getProjects: async (slug: string): Promise<ProjectProp[]> => {

        let result = await ajax<{
            projects: ProjectProp[]
        }>({
            url: 'vn4-e-learning/get-projects',
            data: {
                slug: slug,
            }
        });

        if (result.projects) {
            return result.projects;
        }

        return [];
    },

    getMyProjects: async ({ per_page, current_page }: { current_page: number, per_page: number }): Promise<PaginationProps<ProjectProp> | null> => {

        let result = await ajax<{
            projects: PaginationProps<ProjectProp>
        }>({
            url: 'vn4-e-learning/get-my-projects',
            data: {
                length: per_page,
                page: current_page
            }
        });

        if (result.projects) {
            return result.projects;
        }

        return null;
    },

    editMyProject: async (project: ProjectProp, isDelete = false): Promise<boolean> => {

        let api = await ajax<{
            result: boolean
        }>({
            url: 'vn4-e-learning/edit-my-projects',
            data: {
                ...project,
                isDelete: isDelete,
            }
        });

        return api.result;
    },

    checkStudentReviewedOrNotYet: async (course: string): Promise<null | boolean> => {

        let api = await ajax<{
            isReviewed: 0 | boolean,
        }>({
            url: 'vn4-e-learning/check-student-reviewed-or-not-yet',
            data: {
                course: course,
            }
        });

        if (typeof api.isReviewed === 'boolean') {
            return api.isReviewed;
        }

        return null;
    },

    handleReviewCourse: async (data: { rating: number, content: string, course: string }): Promise<boolean> => {
        let api = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-e-learning/student-review-course',
            data: data
        });

        return api.result;
    },

    getInstructors: async (course: ID): Promise<InstructorProps[]> => {

        return cacheWindow('vn4-e-learning/course/get-instructors/' + course, async () => {

            let api = await ajax<{
                instructors: InstructorProps[],
            }>({
                url: 'vn4-e-learning/course/get-instructors',
                data: {
                    course: course
                }
            });

            return api.instructors;
        });
    },

    getCourseUnfinished: async (): Promise<CourseProps[] | null> => {

        let api = await ajax<{
            courses: CourseProps[],
        }>({
            url: 'vn4-e-learning/me/course-unfinished',
        });

        if (api.courses) {
            return api.courses;
        }

        return null;
    },

    freeTutorial: {
        getCategories: getFreeTutorialCategories,
        getCategory: getFreeTutorialCategory,
        getContent: getFreeTutorialContent,
    },

    page: {
        getPagesOfGroup: getPagesOfGroup,
        getContent: getPageContent,
    },
    qa: {
        get: getQuestionAndAnswer,
        post: postQuestion,
        getDetail: getQuestionDetail,
    },
    user: {
        cv: cv,
    },
    roadmap: {
        getHomePage: async (): Promise<{ roadmaps: Roadmap[] | null } | null> => {
            // return cacheWindow('vn4-e-learning/roadmap/get-home-page', async () => {
            let api = await ajax<{
                roadmaps: Roadmap[] | null,
            }>({
                url: 'vn4-e-learning/roadmap/get-home-page',
            });

            return api;
            // })
        },
        get: async (): Promise<{ roadmaps: Roadmap[] | null } | null> => {
            return cacheWindow('vn4-e-learning/roadmap/get', async () => {
                let api = await ajax<{
                    roadmaps: Roadmap[] | null,
                }>({
                    url: 'vn4-e-learning/roadmap/get',
                });

                return api;
            })
        },
        getOfUser: async (slug: string): Promise<{ roadmaps: Roadmap[] | null } | null> => {
            return cacheWindow('vn4-e-learning/roadmap/get-of-user/' + slug, async () => {
                let api = await ajax<{
                    roadmaps: Roadmap[] | null,
                }>({
                    url: 'vn4-e-learning/roadmap/get-of-user',
                    data: {
                        user: slug,
                    }
                });

                return api;
            })
        },
        getDetail: async (slug: string): Promise<{
            roadmap: Roadmap | null,
            courses: Array<{
                featured_image: string,
                id: ID,
                roadmap_item_related: string,
                slug: string,
                title: string,
            }>,
            process: null | {
                [key: string]: '[none]' | 'done'
            }
        } | null> => {
            // return cacheWindow('vn4-e-learning/roadmap/get-detail/' + slug, async () => {
            let api = await ajax<{
                roadmap: Roadmap | null,
                process: null | {
                    [key: string]: '[none]' | 'done'
                },
                courses: Array<{
                    featured_image: string,
                    id: ID,
                    roadmap_item_related: string,
                    slug: string,
                    title: string,
                }>,
            }>({
                url: 'vn4-e-learning/roadmap/get-detail',
                data: {
                    roadmap: slug
                }
            });

            return api;
            // })
        },
        getDetailOfUser: async (user: string, slug: string): Promise<{
            roadmap: Roadmap | null,
            courses: Array<{
                featured_image: string,
                id: ID,
                roadmap_item_related: string,
                slug: string,
                title: string,
            }>,
            process: null | {
                [key: string]: '[none]' | 'done'
            }
        } | null> => {
            // return cacheWindow('vn4-e-learning/roadmap/get-detail/' + slug, async () => {
            let api = await ajax<{
                roadmap: Roadmap | null,
                process: null | {
                    [key: string]: '[none]' | 'done'
                },
                courses: Array<{
                    featured_image: string,
                    id: ID,
                    roadmap_item_related: string,
                    slug: string,
                    title: string,
                }>,
            }>({
                url: 'vn4-e-learning/roadmap/get-detail-of-user',
                data: {
                    user: user,
                    roadmap: slug
                }
            });

            return api;
            // })
        },
        getDetailItem: async (slug: string): Promise<{ roadmapItem: RoadmapItem | null } | null> => {
            return cacheWindow('vn4-e-learning/roadmap/get-detail-item/' + slug, async () => {
                let api = await ajax<{
                    roadmapItem: RoadmapItem | null,
                }>({
                    url: 'vn4-e-learning/roadmap/get-detail-item',
                    data: {
                        roadmapItem: slug
                    }
                });

                return api;
            })
        },

        getDetailCourse: async (courseID: ID): Promise<{
            roadmaps: [Roadmap] | null,
        } | null> => {
            // return cacheWindow('vn4-e-learning/roadmap/get-detail/' + slug, async () => {
            let api = await ajax<{
                roadmaps: [Roadmap] | null,
            }>({
                url: 'vn4-e-learning/roadmap/get-detail-course',
                data: {
                    courseId: courseID
                }
            });

            return api;
            // })
        },
    },
    staticPage: {
        about: async (): Promise<{ member: TeamMember[] | null } | null> => {
            return cacheWindow('vn4-e-learning/static-page/about', async () => {
                let api = await ajax<{
                    member: TeamMember[] | null,
                }>({
                    url: 'vn4-e-learning/static-page/about',
                });

                return api;
            })
        }
    },

    getCoursePolicy: async (): Promise<CoursePolicyProps[] | null> => {
        return cacheWindow('vn4-e-learning/course-policy', async () => {
            let api = await ajax<{
                policy: CoursePolicyProps[] | null,
            }>({
                url: 'vn4-e-learning/course-policy',
            });

            if (api.policy) {
                api.policy = api.policy.filter(item => !item.delete);
                return api.policy;
            }

            return null;
        })

    },
    instructor: {
        course: {
            getAll: getAll,
        },
        communication: {
            qa: {
                get: getQa,
                updateReaded: updateReaded,
            },
            note: {
                get: getNote
            },
            announcement: {
                get: getAnnouncements,
                addNew: addNewAnnouncement,
                createNotification: createNotification,
            },
            groupAccount: {
                get: getGroupAccount,
                editOrAddNew: addNewGroupAccount,
                getStudent: getStudentOfGroup,
            }
        },
        performance: {
            reviews: {
                get: getReview,
                updateStatus: updateStatusReview,
            },
            students: {
                get: getStudents,
                getProcessOfStudent: getProcessOfStudent,
                addAccountToGroup: addAccountToGroup,
            }
        }
    }
}

export default elearningService;

export interface InstructorProps {
    id: ID,
    name: string,
    job: string,
    linkProfile: string,
    position: string,
    avatar: ImageObjectProps,
    description: string,
    rating: number,
    reviews: number,
    students: number,
    courses: number,
    website: string | false,
    social_facebook?: string,
    social_twitter?: string,
    social_youtube?: string,
    social_linkedin?: string,
    social_github?: string,
}

export interface ProfileNotificationsProps {
    title: string,
    note: string,
    key: string
}

export interface CoursePolicyProps {
    title: string,
    content: string,
    delete: number,
}

export interface TeamMember extends UserProps {
    role: string,
    social_facebook?: string,
    social_twitter?: string,
    social_youtube?: string,
    social_linkedin?: string,
    social_github?: string,
}

export interface Roadmap {
    id: ID,
    title: string,
    slug: string,
    description: string,
    color: string,
    background: string,
    image_code?: string,
    is_save?: 'save' | '[none]',
}

export interface RoadmapItem {
    id: ID,
    title: string,
    key_word: string,
    content: string,
    is_updating?: boolean,
    free_content: Array<{
        title: string,
        content_type: RoadmapItemContentType,
        link: string,
        custom_label?: string,
        is_link_internal: number,
    }>,
    roadmap_related?: Roadmap,
    video_lesson: CourseLessonProps | null,
    course?: {
        id: ID,
        slug: string,
    },
    process: ProcessLearning | null,
}

export type RoadmapItemContentType = 'official-website' | 'official-documentation' | 'library' | 'read' | 'sanbox' | 'watch' | 'course' | 'challenge';
