import { ImageProps } from "components/atoms/Avatar";
import { PaginationProps } from "components/atoms/TablePagination";
import { ICodeChallengeSolutionProps, ISubmissionsPostProps } from "components/pages/CorePage/Exercise/components/ExerciseDetail";
import { trimCharacter } from "helpers/string";
import { ajax } from "hook/useApi";

const codingChallengeService = {

    runCode: async (question_id: ID, lang: ID, typed_code: string): Promise<RuntestProps> => {

        let data = await ajax<{ runner: RuntestProps }>({
            url: 'vn4-e-learning/coding-challenge/1-run-code',
            data: {
                question_id,
                lang,
                typed_code,
            }
        });

        return data.runner;
    },

    runCodeCheck: async (runer_id: ID): Promise<RuntestProps> => {

        let data = await ajax<{ runer: RuntestProps }>({
            url: 'vn4-e-learning/coding-challenge/1-run-code-check',
            data: {
                runer_id,
            }
        });

        try {
            data.runer.result = typeof data.runer.result === 'string' ? JSON.parse(data.runer.result) : [];
        } catch (error) {
            data.runer.result = [];
        }

        return data.runer;
    },


    postSubmission: async (question_id: ID, lang: ID, typed_code: string): Promise<{
        public_id: string
    }> => {

        let data = await ajax<{
            runner: {
                public_id: string
            }
        }>({
            url: 'vn4-e-learning/coding-challenge/2-post-submission',
            data: {
                question_id,
                lang,
                typed_code,
            }
        });

        return data.runner;
    },

    postSubmissionCheck: async (runer_id: ID): Promise<ISubmissionsPostProps> => {

        let data = await ajax<{ runer: ISubmissionsPostProps }>({
            url: 'vn4-e-learning/coding-challenge/2-post-submission-check',
            data: {
                runer_id,
            }
        });

        try {
            data.runer.info_last_testcase = typeof data.runer.info_last_testcase === 'string' ? JSON.parse(data.runer.info_last_testcase) : undefined;
        } catch (error) {
            data.runer.info_last_testcase = undefined;
        }

        return data.runer;
    },

    getChallenges: async (current_page: number, type: 'tag' | 'compnay' | 'all', meta?: string, searchData?: { [key: string]: ANY }): Promise<PaginationProps<CodingChallengeProps> | 'subscription_required'> => {

        let data = await ajax<{ subscription_required: boolean } | PaginationProps<CodingChallengeProps>>({
            url: 'vn4-e-learning/coding-challenge/list',
            data: {
                page: current_page,
                meta: meta,
                type: type,
                searchData: searchData,
            }
        });

        if (data.subscription_required) {
            return 'subscription_required';
        }

        return data as PaginationProps<CodingChallengeProps>;

    },
    listStudyFeatured: async (): Promise<StudyPlanProps[]> => {

        let data = await ajax<{ data: StudyPlanProps[] }>({
            url: 'vn4-e-learning/coding-challenge/list-study-featured',
        });

        return data.data;

    },
    getStudyPlanDetail: async (slug: string): Promise<StudyPlanProps> => {

        let data = await ajax<{ post: StudyPlanProps }>({
            url: 'vn4-e-learning/coding-challenge/4-study-plan-detail',
            data: {
                slug: slug
            }
        });

        return data.post;

    },
    joinStudyPlan: async (id: ID): Promise<boolean> => {
        let data = await ajax<{ result: boolean }>({
            url: 'vn4-e-learning/coding-challenge/4-join-study-plan',
            data: {
                id
            }
        });

        return data.result;
    },
    getMyStudyPlan: async (): Promise<StudyPlanProps[]> => {
        let data = await ajax<{ study_plans: StudyPlanProps[] }>({
            url: 'vn4-e-learning/coding-challenge/4-get-my-study-plan',
        });

        return data.study_plans;
    },
    listStudyPlanGroup: async (): Promise<Array<StudyPlanGroup>> => {

        let data = await ajax<{
            data: Array<StudyPlanGroup>
        }>({
            url: 'vn4-e-learning/coding-challenge/list-study-plan-group',
        });

        return data.data;

    },
    listCompany: async (current_page: number, length = 20, title = ''): Promise<PaginationProps<CompanyProps>> => {

        let data = await ajax<PaginationProps<CompanyProps>>({
            url: 'vn4-e-learning/coding-challenge/list-company',
            data: {
                page: current_page,
                length: length,
                title: title,
            }
        });

        return data;

    },
    detail: async (slug: string): Promise<CodingChallengeProps | null | 'subscription_required'> => {

        let data = await ajax<{ post: CodingChallengeProps | null, subscription_required: boolean }>({
            url: 'vn4-e-learning/coding-challenge/detail',
            data: {
                slug: slug
            }
        });

        if (data.subscription_required) {
            return 'subscription_required'
        }

        if (data.post) {
            try {
                data.post.content_examples = typeof data.post.content_examples === 'string' ? JSON.parse(data.post.content_examples) : [];
            } catch (error) {
                data.post.content_examples = [];
            }

            try {
                data.post.content_constraints = typeof data.post.content_constraints === 'string' ? JSON.parse(data.post.content_constraints) : [];
            } catch (error) {
                data.post.content_constraints = [];
            }

            try {
                data.post.code_snippets = typeof data.post.code_snippets === 'string' ? JSON.parse(data.post.code_snippets) : [];
            } catch (error) {
                data.post.code_snippets = [];
            }
            try {
                data.post.hints = typeof data.post.hints === 'string' ? JSON.parse(data.post.hints) : [];
            } catch (error) {
                data.post.hints = [];
            }
            try {
                data.post.testcase = typeof data.post.testcase === 'string' ? JSON.parse(data.post.testcase) : [];

                data.post.testcase.cases.forEach((item, index) => {
                    (data.post as CodingChallengeProps).testcase.cases[index].inputs = item.variable_values.split('\n');
                });

            } catch (error) {
                data.post.testcase = {
                    variable_names: [],
                    function_name: '',
                    cases: [],
                };
            }

            if (!data.post.testcase.cases) data.post.testcase.cases = [];

            return data.post;
        }

        return null;
    },
    getTagList: async (): Promise<ChallengeTagProps[]> => {
        let data = await ajax<{ posts: ChallengeTagProps[] | null }>({
            url: 'vn4-e-learning/coding-challenge/get-tag-all',
        });

        if (data.posts) {
            return data.posts;
        }

        return [];
    },
    getTagDetail: async (slug: string): Promise<ChallengeTagProps | null> => {
        let data = await ajax<{ post: ChallengeTagProps | null }>({
            url: 'vn4-e-learning/coding-challenge/get-tag-detail',
            data: {
                slug: slug
            }
        });

        if (data.post) {
            return data.post;
        }

        return null;
    },
    getCompanyDetail: async (slug: string): Promise<ChallengeCompanyProps | null> => {
        let data = await ajax<{ post: ChallengeCompanyProps | null }>({
            url: 'vn4-e-learning/coding-challenge/get-company-detail',
            data: {
                slug: slug
            }
        });

        if (data.post) {
            return data.post;
        }

        return null;
    },
    getOfficialsolution: async (slug: string): Promise<ChallengeOfficialSolutionProps | null | 'subscription_required'> => {

        let data = await ajax<{ post: ChallengeOfficialSolutionProps | null, subscription_required: boolean }>({
            url: 'vn4-e-learning/coding-challenge/get-official-solution',
            data: {
                slug: slug
            }
        });

        if (data.subscription_required) {
            return 'subscription_required';
        }

        if (data.post) {
            try {
                data.post.approaches = typeof data.post.approaches === 'string' ? JSON.parse(data.post.approaches) : [];
            } catch (error) {
                data.post.approaches = [];
            }
            return data.post;
        }

        return null;
    },


    // postSubmission: async (slug: string, data: ISubmissionsPostProps): Promise<boolean> => {

    //     let post = await ajax<{ result: boolean }>({
    //         url: 'vn4-e-learning/coding-challenge/post-submission',
    //         data: {
    //             ...data,
    //             slug
    //         },
    //     });

    //     return post.result;

    // },

    listingSubmissions: async (id: ID, page: number): Promise<PaginationProps<ISubmissionsPostProps> | null> => {
        let post = await ajax<{ data: PaginationProps<ISubmissionsPostProps> }>({
            url: 'vn4-e-learning/coding-challenge/get-submissions',
            data: {
                id,
                page
            },
        });

        if (post.data) {
            return post.data;
        }

        return null;
    },

    saveNotes: async (id: number, notes: string, color: string): Promise<boolean> => {
        let post = await ajax<{ result: boolean }>({
            url: 'vn4-e-learning/coding-challenge/save-notes',
            data: {
                id,
                notes,
                color
            },
        });

        return post.result;
    },

    submitSolution: async (id: number, title: string, content: string): Promise<boolean> => {
        let post = await ajax<{ result: boolean }>({
            url: 'vn4-e-learning/coding-challenge/submit-solution',
            data: {
                id,
                content,
                title
            },
        });

        return post.result;
    },

    getSolutions: async (id: string | number, page: number): Promise<PaginationProps<ICodeChallengeSolutionProps> | null> => {
        let post = await ajax<{ data: PaginationProps<ICodeChallengeSolutionProps> }>({
            url: 'vn4-e-learning/coding-challenge/get-solutions',
            data: {
                id,
                page
            },
        });

        if (post.data) {
            return post.data;
        }

        return null;
    },
    getDetailSolution: async (id: ID, upview: boolean): Promise<ICodeChallengeSolutionProps | null> => {
        let result = await ajax<{ post: ICodeChallengeSolutionProps | null }>({
            url: 'vn4-e-learning/coding-challenge/get-solution-detail',
            data: {
                id,
                upview,
            },
        });

        if (result.post) {
            return result.post;
        }

        return null;
    },
    getDailyChallenges: async (month: number, year: number): Promise<{ [key: number]: CodingChallengeProps }> => {
        let result = await ajax<{ challenges: { [key: number]: CodingChallengeProps } }>({
            url: 'vn4-e-learning/coding-challenge/get-daily-challenges',
            data: {
                month: month,
                year: year,
            }
        });

        if (result.challenges) {
            return result.challenges;
        }

        return {};
    },

    getSessionCurrent: async (): Promise<CodingChallengeSessionProps> => {
        let result = await ajax<{ data: CodingChallengeSessionProps }>({
            url: 'vn4-e-learning/coding-challenge/3-get-session',
        });

        try {
            result.data.challenge_solved = typeof result.data.challenge_solved === 'string' ? (result.data.challenge_solved as string).split(', ').reduce((acc: { [key: string]: true }, curr) => {
                acc[curr] = true;
                return acc;
            }, {}) : {}
        } catch (error) {
            result.data.challenge_solved = {};
        }

        try {
            result.data.challenge_attempted = typeof result.data.challenge_attempted === 'string' ? (result.data.challenge_attempted as string).split(', ').reduce((acc: { [key: string]: true }, curr) => {
                acc[curr] = true;
                return acc;
            }, {}) : {}
        } catch (error) {
            result.data.challenge_attempted = {};
        }

        result.data.question_easy_count ||= 0;
        result.data.question_medium_count ||= 0;
        result.data.question_hard_count ||= 0;

        result.data.sessions.forEach(item => {
            item.question_easy_count ||= 0;
            item.question_medium_count ||= 0;
            item.question_hard_count ||= 0;
        });

        return result.data;
    },

    updateSessionCurrent: async (id: ID, action: 'active' | 'delete' | 'change_name', title?: string): Promise<boolean> => {
        let result = await ajax<{ result: boolean }>({
            url: 'vn4-e-learning/coding-challenge/3-update-session-current',
            data: {
                id,
                action,
                title
            }
        });

        return result.result;
    },

    createNewSession: async (title: string): Promise<boolean> => {
        let result = await ajax<{ result: boolean }>({
            url: 'vn4-e-learning/coding-challenge/3-create-new-session',
            data: {
                title
            }
        });

        return result.result;
    },
}

export interface CodingChallengeSessionProps {
    id: ID,
    title: string,
    question_easy_count: number,
    question_medium_count: number,
    question_hard_count: number,
    count_easy: number,
    count_medium: number,
    count_hard: number,
    active: boolean,
    removable: boolean,
    challenge_solved: { [key: string]: true },
    challenge_attempted: { [key: string]: true },
    sessions: CodingChallengeSessionProps[],
}

export interface CodingChallengeProps {
    id: number,
    title: string,
    slug: string,
    content: string,
    content_examples: Array<{
        title: string,
        input: string,
        output: string,
        explanation: string,
        image?: string,
    }>,
    content_constraints: Array<string>,

    difficulty: 'easy' | 'medium' | 'hard',
    // challenge_files: Array<ITemplateCodeFile>,
    code_snippets: CodeSnippet[],
    hints: string[],
    testcase: CodingChallengeTestcaseProps,
    number_of_submissions: number,
    l_number_submissions?: number,
    paid_only: boolean,
    l_number_submissions_accepted?: number,
    success_rate: number,
    comment_count: number,
    tags: Array<ChallengeTagProps>
    similar_questions: Array<CodingChallengeProps>
    companies: Array<ChallengeCompanyProps>,
    public_testcase: Array<{
        [key: string]: ANY,
        expected: ANY,
    }>,
    is_free_editorial: boolean,
}
export interface ChallengeTagProps {
    id: ID,
    title: string,
    slug: string,
    challenge_count: number,
}
export interface ChallengeCompanyProps {
    id: ID,
    title: string,
    slug: string,
    logo?: ImageProps,
}
export interface ChallengeOfficialSolutionProps {
    id: ID,
    challenge_id: ID,
    content: string,
    approaches: Array<{
        title: string,
        content: string,
        code_sample: string,
        complexity_time: string,
        complexity_memory: string,
    }>,
    rating: number,
    reviewNumber: number,
}

export function convertValue(value: ANY): ANY {
    if (value === undefined) return 'undefined'
    if (value === null) return 'null'
    if (value === 0) return '0'

    return trimCharacter(JSON.stringify(value), '"');
}

export interface CodingChallengeTestcaseProps {
    function_name: string,
    variable_names: Array<{
        name: string,
    }>,
    cases: Array<{
        variable_values: string,
        inputs: string[],
        output: string,
        is_public: boolean,
    }>,
    // inputs: Array<{
    //     variable_name: string,
    //     variable_value: string,
    // }>,
    // output: string,
    // is_public: boolean,
    // success: null | boolean,
}

export interface StudyPlanProps {
    id: ID,
    title: string,
    slug: string,
    description: string,
    summary: string,
    thumbnail: ImageProps,
    study_plans: Array<StudyPlanProps>,
    challenge_count: number,
    joined: boolean,
    structure: Array<{
        title: string,
        challenges: Array<CodingChallengeProps>
    }>,
    percent: number,
    last_lesson?: {
        title: string,
        slug: string,
    },
}

export interface CompanyProps {
    id: ID,
    title: string,
    slug: string,
    challenge_count: number,
}

export default codingChallengeService

export interface CodeSnippet {
    lang: string,
    langSlug: string,
    code: string
}

export interface StudyPlanGroup {
    title: string,
    study_plans: StudyPlanProps[],
}

export interface DailyChallengeProps {
    date: number,
    challenge: CodingChallengeProps,
}

export interface RuntestProps {
    public_id: string,
    state: 'created' | 'finished',
    result: Array<{
        memoryUsed: number,
        executionTime: number,
        isCorrect: boolean,
        result?: ANY
    }>,
}