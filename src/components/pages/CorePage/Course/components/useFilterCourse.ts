import useQuery from 'hook/useQuery';

function useFilterCourse() {

    const urlParam = useQuery({
        filter_t: 'lesson',
    });

    return {
        isCourse: urlParam.query.filter_t !== 'lesson' && urlParam.query.filter_t !== 'chapter',
        isChapter: urlParam.query.filter_t === 'chapter',
        isLesson: urlParam.query.filter_t === 'lesson',
        change: (filter: 'course' | 'chapter' | 'lesson') => {
            urlParam.changeQuery({ filter_t: filter });
        }
    }
}

export default useFilterCourse