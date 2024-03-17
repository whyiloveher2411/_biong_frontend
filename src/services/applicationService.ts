import { ajax } from "hook/useApi";

const applicationService = {
    detail: async (slug: string): Promise<IApplicationProps> => {

        let data = await ajax<{ post: IApplicationProps }>({
            url: 'vn4-e-learning/application/detail',
            data: {
                slug
            }
        });

        return data.post;

    },
}

export interface IApplicationProps {
    id: ID,
    title: string,
    description: string,
    domain: string,
    test_domain: string,
    app_id_random: string,
    account_owner: ID,
}


export default applicationService