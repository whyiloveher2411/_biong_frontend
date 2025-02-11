import { ajax } from "hook/useApi";

const getUrl = (url: string) => ({
    url: url,
    urlPrefix: 'http://localhost:8080',
});

const englishService = {
    getWelcome: async (): Promise<{ message: string }> => {
        let data = await ajax<{ message: string }>({
            ...getUrl(''),
            method: 'POST',
        });
        return data;
    },

    getEnglish: async (): Promise<Word[]> => {
        let data = await ajax<Word[]>({
            ...getUrl('words'),
            method: 'POST',
        });
        return data;
    }
};

export interface Word {
    id: number;
    Text: string;
}


export default englishService;