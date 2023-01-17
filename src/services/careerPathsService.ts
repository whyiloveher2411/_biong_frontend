import { ajax } from "hook/useApi";
import { CourseProps } from "./courseService";
import { Roadmap } from "./elearningService";


const careerPathsService = {
    getHomepage: async (): Promise<ICareerPaths[]> => {

        let data = await ajax<{ posts: ICareerPaths[] }>({
            url: 'vn4-e-learning/career-paths/get-homepage',
        });

        return data.posts;

    },
    getDetail: async (slug: string): Promise<ICareerPaths | undefined> => {

        let data = await ajax<{ post?: ICareerPaths }>({
            url: 'vn4-e-learning/career-paths/get-detail',
            data: {
                slug: slug,
            }
        });

        if (data.post && typeof data.post.content === 'string') {
            try {
                data.post.content = JSON.parse(data.post.content);
            } catch (error) {
                data.post.content = [];
            }
        }

        return data.post;

    },
}

export default careerPathsService;

export interface ICareerPaths {
    id: string,
    title: string,
    short_description: string,
    long_description: string,
    color: string,
    featured_image: string,
    slug: string,
    roadmaps?: Roadmap[],
    content?: Array<{
        title: string,
        description: string,
        courses: CourseProps[],
    }>
    completion?: { [key: ID]: number },
    count_save_fake: number,
    count_save: number,
    my_reaction_type: string,
}