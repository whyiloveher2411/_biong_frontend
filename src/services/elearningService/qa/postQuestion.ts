import { ajax } from 'hook/useApi';

export default async ({ title, content, courseID, chapterID, lessonID, is_incognito }: { title: string, content: string, courseID: ID, chapterID: ID, lessonID: ID, is_incognito: boolean }): Promise<boolean | null> => {

    let api = await ajax<{
        result: boolean,
    }>({
        url: 'vn4-e-learning/course/qa/post',
        data: {
            title: title,
            content: content,
            courseID: courseID,
            chapterID: chapterID,
            lessonID: lessonID,
            is_incognito: is_incognito,
        },
    });

    if (api.result) {
        return api.result;
    }

    return null;

}
