import { ICourseTest, ITestType } from "services/elearningService";
import { ajax } from 'hook/useApi';
import { ImageProps } from "components/atoms/Avatar";

const testService = {
    checkEntryTest: async (key: string, test_rule: string): Promise<ITestStatus> => {
        let api = await ajax<ITestStatus>({
            url: 'vn4-e-learning/me/test/check-entry-test',
            data: {
                key: key,
                test_rule: test_rule
            }
        });

        if (typeof api.test_data?.addin_data === 'string') {
            try {
                api.test_data.addin_data = JSON.parse(api.test_data.addin_data);
            } catch (error) {
                api.test_data.addin_data = null;
            }

        }

        return api;
    },
    checkCourseTest: async (course: string): Promise<{
        entry: ITestStatus | null,
        exit: ITestStatus | null,
    }> => {
        let api = await ajax<{
            entry: ITestStatus | null,
            exit: ITestStatus | null,
        }>({
            url: 'vn4-e-learning/me/test/check-course-test',
            data: {
                course: course
            }
        });

        if (typeof api.entry?.test_data?.addin_data === 'string') {
            try {
                api.entry.test_data.addin_data = JSON.parse(api.entry.test_data.addin_data);
            } catch (error) {
                api.entry.test_data.addin_data = null;
            }

        }

        if (typeof api.exit?.test_data?.addin_data === 'string') {
            try {
                api.exit.test_data.addin_data = JSON.parse(api.exit.test_data.addin_data);
            } catch (error) {
                api.exit.test_data.addin_data = null;
            }

        }

        return api;
    },
    getEntryTest: async (key: string, test_rule: string, reset = 0): Promise<ICourseTest | null> => {
        let api = await ajax<{
            test?: ICourseTest,
        }>({
            url: 'vn4-e-learning/me/test/get-entry-test',
            data: {
                key: key,
                test_rule: test_rule,
                reset: reset,
            }
        });
        if (api.test) {
            try {
                if (api.test.answer && typeof api.test.answer === 'string') {
                    api.test.my_answer = JSON.parse(api.test.answer);
                }
            } catch (error) {
                api.test.my_answer = {};
            }


            api.test.tests.forEach(item => {
                try {
                    item.optionsObj = JSON.parse(item.options);
                } catch (error) {
                    item.optionsObj = null;
                }
            });
            return api.test;
        }

        return null;
    },

    getCategoryTest: async (key: string, category: ID, reset: number): Promise<{
        test: ICourseTest,
        summary: TestCategorySummary,
    } | null> => {
        let api = await ajax<{
            test: ICourseTest,
            summary: {
                tests: Array<ITestType>,
                answer: {
                    answer_wrong: string,
                    answer_right: string,
                },
                question_time_report: Array<{
                    count: number,
                    created_time: number,
                }>,
                time_server: number,
            },
        }>({
            url: 'vn4-e-learning/me/test/get-category-test',
            data: {
                key: key,
                category: category,
                reset: reset,
            }
        });
        if (api.test) {
            try {
                if (api.test.answer && typeof api.test.answer === 'string') {
                    api.test.my_answer = JSON.parse(api.test.answer);
                }
            } catch (error) {
                api.test.my_answer = {};
            }


            api.test.tests.forEach(item => {
                try {
                    item.optionsObj = JSON.parse(item.options);
                } catch (error) {
                    item.optionsObj = null;
                }
            });

            api.summary.tests.forEach(question => {
                try {
                    question.optionsObj = JSON.parse(question.options);
                } catch (error) {
                    question.optionsObj = null;
                }
            });

            let answers: { [key: ID]: boolean } = {};

            if (api.summary.answer.answer_right) {
                const anwsersId = api.summary.answer.answer_right.split(',');

                anwsersId.forEach(key => {
                    answers[key] = true;
                });
            }

            if (api.summary.answer.answer_wrong) {
                const anwsersId = api.summary.answer.answer_wrong.split(',');

                anwsersId.forEach(key => {
                    answers[key] = false;
                });
            }

            return {
                test: api.test,
                summary: {
                    tests: api.summary.tests,
                    answers: answers,
                    count_question_one_hour: api.summary.question_time_report.reduce((count, item) => count + item.count, 0),
                    question_time_report: api.summary.question_time_report,
                    time_server: api.summary.time_server,
                },
            };
        }

        return null;
    },

    getAllTestOfCategory: async (category: ID): Promise<{
        tests: Array<ITestType>,
        answers: {
            [key: ID]: boolean
        }
    } | null> => {
        let api = await ajax<{
            tests?: Array<ITestType>,
            answer: {
                answer_wrong: string,
                answer_right: string,
            }
            // answers: {
            //     [key: ID]: {
            //         is_right: boolean
            //     }
            // }
        }>({
            url: 'vn4-e-learning/me/test/get-all-test-category',
            data: {
                category: category,
            }
        });
        if (api.tests) {
            // try {
            //     if (api.test.answer && typeof api.test.answer === 'string') {
            //         api.test.my_answer = JSON.parse(api.test.answer);
            //     }
            // } catch (error) {
            //     api.test.my_answer = {};
            // }

            api.tests.forEach(question => {
                try {
                    question.optionsObj = JSON.parse(question.options);
                } catch (error) {
                    question.optionsObj = null;
                }
            });

            let answers: { [key: ID]: boolean } = {};

            if (api.answer.answer_right) {
                const anwsersId = api.answer.answer_right.split(',');

                anwsersId.forEach(key => {
                    answers[key] = true;
                });
            }

            if (api.answer.answer_wrong) {
                const anwsersId = api.answer.answer_wrong.split(',');

                anwsersId.forEach(key => {
                    answers[key] = false;
                });
            }

            return {
                tests: api.tests,
                answers: answers,
            };
        }

        return null;
    },

    submitAnswer: async (key: string, test: ID, answer: { [key: ID]: ANY }): Promise<boolean> => {

        let api = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-e-learning/me/test/post-entry-test',
            data: {
                key: key,
                test: test,
                answer: answer,
            }
        });

        return api.result;
    },

    submitAnswerQuestion: async (test: ID, answer: ANY): Promise<boolean | null> => {

        let api = await ajax<{
            result: boolean,
            is_right: boolean,
        }>({
            url: 'vn4-e-learning/me/test/post-submit-question',
            data: {
                test: test,
                answer: answer,
            }
        });

        if (api.is_right !== undefined) {
            return api.is_right;
        }

        return null;
    },

    submitTestOfLesson: async (lessonID: ID, answer: { [key: ID]: ANY }): Promise<{
        point: number,
        total_point: number,
    }> => {

        let api = await ajax<{
            point: number,
            total_point: number,
        }>({
            url: 'vn4-e-learning/me/test/post-tests-lesson',
            data: {
                lesson: lessonID,
                answer: answer,
            }
        });

        return api;
    },

    getHomepageTestCategory: async (): Promise<{
        posts: Array<IHomePageTestItem>,
        total: number,
    }> => {

        let api = await ajax<{
            posts: Array<IHomePageTestItem>,
            total: number,
        }>({
            url: 'vn4-e-learning/me/test/get-homepage-widget',
        });

        return api;
    },

    getFreeTest: async (key: string, test_rule: {
        category: ID,
    }): Promise<ICourseTest | null> => {
        let api = await ajax<{
            test?: ICourseTest,
        }>({
            url: 'vn4-e-learning/me/test/get-free-test',
            data: {
                key: key,
                test_rule: test_rule,
            }
        });
        if (api.test) {
            try {
                if (api.test.answer && typeof api.test.answer === 'string') {
                    api.test.my_answer = JSON.parse(api.test.answer);
                }
            } catch (error) {
                api.test.my_answer = {};
            }


            api.test.tests.forEach(item => {
                try {
                    item.optionsObj = JSON.parse(item.options);
                } catch (error) {
                    item.optionsObj = null;
                }
            });
            return api.test;
        }

        return null;
    },

    getTestHistory: async (id: ID): Promise<Array<ICourseTest> | null> => {

        let api = await ajax<{
            tests?: Array<ICourseTest>,
        }>({
            url: 'vn4-e-learning/me/test/get-history',
            data: {
                id: id,
            }
        });
        if (api.tests) {
            return api.tests;
        }

        return null;
    }
}

export default testService

export interface ITestStatus {
    is_create: boolean,
    is_continue: boolean,
    total_point?: number,
    point?: number,
    test_data?: {
        addin_data?: {
            content?: string,
            learn_link?: Array<{
                lable_button: string,
                link: string,
            }>
        } | null,
        description?: string,
        time: number,
    }
}


export interface IHomePageTestItem {
    title: string,
    description: string,
    image: ImageProps,
    category: ID,
    count: number,
    slug: string,
}

interface TestCategorySummary {
    tests: Array<ITestType>,
    answers: {
        [key: ID]: boolean
    },
    count_question_one_hour: number,
    question_time_report: Array<{
        count: number,
        created_time: number,
    }>,
    time_server: number,
}