import { ajax } from 'hook/useApi';

export default async ({ title, content, courseID, chapterID, lessonID }: { title: string, content: string, courseID: ID, chapterID: ID, lessonID: ID }): Promise<boolean | null> => {

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
        },
    });

    if (api.result) {
        return api.result;
    }

    return null;

}
