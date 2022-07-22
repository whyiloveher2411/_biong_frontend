import { ajax } from 'hook/useApi';

const contactService = {
    postContact: async (data: { [key: string]: ANY }): Promise<boolean> => {

        let post = await ajax<{
            result: boolean
        }>({
            url: 'vn4-account/contact/post',
            data: data,
        });

        return post.result;
    },
}

export default contactService;