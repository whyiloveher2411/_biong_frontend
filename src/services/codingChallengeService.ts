import { PaginationProps } from "components/atoms/TablePagination";
import { ITemplateCodeFile } from "components/pages/CorePage/Course/components/SectionLearn/SectionContentType/Freecodecamp/TemplateFreecode";
import { ICodeChallengeSolutionProps, ISubmissionsPostProps } from "components/pages/CorePage/Exercise/ExerciseDetail";
import { ajax } from "hook/useApi";

const codingChallengeService = {
    list: async (current_page: number): Promise<PaginationProps<CodingChallengeProps>> => {

        let data = await ajax<PaginationProps<CodingChallengeProps>>({
            url: 'vn4-e-learning/coding-challenge/list',
            data: {
                page: current_page
            }
        });

        return data;

    },
    detail: async (slug: string): Promise<CodingChallengeProps | null> => {

        let data = await ajax<{ post: CodingChallengeProps | null }>({
            url: 'vn4-e-learning/coding-challenge/detail',
            data: {
                slug: slug
            }
        });

        if (data.post) {
            try {
                data.post.challenge_files = typeof data.post.challenge_files === 'string' ? JSON.parse(data.post.challenge_files) : [];
            } catch (error) {
                data.post.challenge_files = [];
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

            console.log(data.post.testcase);

            if (!data.post.testcase.cases) data.post.testcase.cases = [];

            console.log(data.post.testcase);
            return data.post;
        }

        return null;
    },

    postSubmission: async (slug: string, data: ISubmissionsPostProps): Promise<boolean> => {

        let post = await ajax<{ result: boolean }>({
            url: 'vn4-e-learning/coding-challenge/post-submission',
            data: {
                ...data,
                slug
            },
        });

        return post.result;

    },

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
}


export interface CodingChallengeProps {
    id: number,
    title: string,
    slug: string,
    description: string,
    editorial: string,
    difficulty: 'easy' | 'medium' | 'hard',
    challenge_files: Array<ITemplateCodeFile>,
    testcase: CodingChallengeTestcaseProps,
    number_of_submissions: number,
    success_rate: number,
    comment_count: number,
}

export function convertValue(value: ANY): ANY {
    if (value === undefined) return 'undefined'
    if (value === null) return 'null'
    if (value === 0) return '0'

    return value;
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

export default codingChallengeService