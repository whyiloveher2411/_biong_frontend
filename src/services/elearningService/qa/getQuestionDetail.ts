import { ajax } from 'hook/useApi';
import { QuestionAndAnswerProps } from '../@type';

export default async ({
    courseID,
    lessonID,
    chapterID,
    questionID
}: {
    courseID: ID,
    lessonID: ID,
    chapterID: ID,
    questionID: ID,
}): Promise<QuestionAndAnswerProps | null> => {

    let api = await ajax<{
        post: QuestionAndAnswerProps,
    }>({
        url: 'vn4-e-learning/course/qa/get-detail',
        data: {
            course: courseID,
            lesson: lessonID,
            chapter: chapterID,
            question: questionID,
        },
    });

    if (api.post) {
        return api.post;
    }

    return null;

}
