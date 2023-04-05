import { ICourseTest } from "services/elearningService";
import { ajax } from 'hook/useApi';

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
    getEntryTest: async (key: string, test_rule: string): Promise<ICourseTest | null> => {
        let api = await ajax<{
            test?: ICourseTest,
        }>({
            url: 'vn4-e-learning/me/test/get-entry-test',
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