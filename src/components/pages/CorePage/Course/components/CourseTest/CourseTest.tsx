// import { LoadingButton } from '@mui/lab';
// import { Button, Skeleton } from '@mui/material';
// import Box from 'components/atoms/Box';
// import Typography from 'components/atoms/Typography';
// import { useWebBrowser } from 'components/atoms/WebBrowser';
// import DrawerCustom from 'components/molecules/DrawerCustom';
// import NoticeContent from 'components/molecules/NoticeContent';
// import { __ } from 'helpers/i18n';
// import { toCamelCase } from 'helpers/string';
// import React from 'react';
// import courseService, { TestProps } from 'services/courseService';
// import CourseLearningContext, { CourseLearningContextProps } from '../../context/CourseLearningContext';
// import { UserState, useUser } from 'store/user/user.reducers';
// import { LoginForm } from 'components/organisms/components/Auth/Login';

function CourseTest({ testId, onSubmited, onClose, title }: {
    testId: ID | null,
    onSubmited?: () => void,
    onClose?: () => void,
    title?: string,
}) {

    return <></>
}
// function CourseTest({ testId, onSubmited, onClose, title }: {
//     testId: ID | null,
//     onSubmited?: () => void,
//     onClose?: () => void,
//     title?: string,
// }) {

//     const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

//     const user = useUser();

//     const [test, setTest] = React.useState<TestProps | null>(null);

//     const [selected, setSelected] = React.useState<{
//         [key: string]: ANY
//     }>({});

//     const [showAnswerRight, setShowAnswerRight] = React.useState(false);

//     const [questionIndexCurrent, setQuestionIndexCurrent] = React.useState(0);

//     const [openLoading, setOpenLoading] = React.useState(false);

//     const webBrowser = useWebBrowser();

//     const onSubmitTest = async () => {
//         if (testId) {

//             setOpenLoading(true);

//             const result = await courseService.me.test.post(testId, selected);
//             setOpenLoading(false);

//             if (result) {

//                 if (onSubmited) {
//                     onSubmited();
//                 }

//                 if (onClose) {
//                     onClose();
//                     return;
//                 }

//                 courseLearningContext.addAnswerTest(testId);
//                 courseLearningContext.openTest(null);
//             }
//         }
//     }

//     React.useEffect(() => {
//         if (testId && user._state === UserState.identify) {
//             (async () => {
//                 const test = await courseService.me.test.get(testId);
//                 setTest(test);

//                 if (test?.my_answer) {
//                     setShowAnswerRight(true);
//                     setSelected(test?.my_answer);
//                 } else {
//                     setSelected({});
//                     setShowAnswerRight(false);
//                 }

//                 setQuestionIndexCurrent(0);
//                 if (test) {
//                     if (title) {
//                         webBrowser.setSeo(prev => ({ ...prev, title: test?.title + ' - ' + title }));
//                     } else {
//                         webBrowser.setSeo(prev => ({ ...prev, title: test?.title + (courseLearningContext.course?.title ? (' - ' + courseLearningContext.course?.title) : '') }));
//                     }
//                 }
//             })();
//         } else {
//             setTimeout(() => {
//                 setTest(null);
//             }, 300);
//         }
//     }, [testId, user]);

//     return (<DrawerCustom
//         open={testId !== null}
//         onClose={() => {
//             if (onClose) {
//                 onClose();
//                 return;
//             }
//             courseLearningContext.openTest(null)
//         }
//         }
//         onCloseOutsite
//         title={test ? test.title : ""}
//         width={700}
//         height="100%"
//     >
//         <Box
//             sx={{
//                 minHeight: '100%',
//                 pt: 3,
//                 pb: 3,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 3,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 width: '100%',
//             }}
//         >
//             {
//                 user._state === UserState.nobody ?
//                     <LoginForm title='Đăng nhập để tiếp tục' />
//                     :
//                     <>
//                         {

//                             test ?
//                                 test.content.length ?
//                                     test.content[questionIndexCurrent] ?
//                                         <Box
//                                             sx={{
//                                                 width: '100%',
//                                             }}
//                                         >
//                                             <Typography variant='h2' sx={{ mb: 3, }}>Câu hỏi {questionIndexCurrent + 1} / {test.content.length} </Typography>

//                                             {
//                                                 (() => {
//                                                     let compoment = toCamelCase(test.content[questionIndexCurrent].type);
//                                                     try {
//                                                         //eslint-disable-next-line
//                                                         let resolved = require(`./${compoment}`).default;
//                                                         return React.createElement(resolved, {
//                                                             question: test.content[questionIndexCurrent],
//                                                             showAnswerRight: showAnswerRight,
//                                                             selected: selected[test.content[questionIndexCurrent].code],
//                                                             onChange: (value: ANY) => {
//                                                                 setSelected(prev => ({
//                                                                     ...prev,
//                                                                     [test.content[questionIndexCurrent].code]: value
//                                                                 }))
//                                                             }
//                                                         });
//                                                     } catch (error) {
//                                                         console.log(compoment);
//                                                     }
//                                                 })()
//                                             }
//                                         </Box>
//                                         :
//                                         <></>
//                                     :
//                                     <NoticeContent
//                                         title={__('Nội dung đang cập nhật')}
//                                         description=''
//                                         image='/images/undraw_no_data_qbuo.svg'
//                                         disableButtonHome
//                                     />
//                                 :
//                                 [1, 2, 3, 4, 5, 6, 7].map(item => (
//                                     <Skeleton key={item} variant='rectangular' sx={{ width: '100%', height: 42 }} />
//                                 ))
//                         }
//                         {
//                             test && test.content.length ?
//                                 <Box
//                                     sx={{
//                                         display: 'flex',
//                                         gap: 1,
//                                         justifyContent: 'space-between',
//                                         alignItems: 'center',
//                                         width: '100%',
//                                     }}
//                                 >
//                                     {/* <Button
//                             disabled={questionIndexCurrent < 1}
//                             color='inherit'
//                             variant='contained'
//                             onClick={() => {
//                                 setShowAnswerRight(false);
//                                 setQuestionIndexCurrent(prev => {
//                                     if (selected[prev - 1]) {
//                                         delete selected[prev - 1];
//                                         setSelected({ ...selected });
//                                     }
//                                     return prev - 1;
//                                 });
//                             }}
//                         >Quay lại</Button> */}
//                                     {
//                                         test.my_answer ?
//                                             <>
//                                                 <Button
//                                                     disabled={questionIndexCurrent < 1}
//                                                     color='inherit'
//                                                     variant='contained'
//                                                     onClick={() => {
//                                                         setQuestionIndexCurrent(prev => prev > 0 ? --prev : prev);
//                                                     }}
//                                                 >Quay lại</Button>
//                                                 <Button
//                                                     disabled={questionIndexCurrent >= (test.content.length - 1)}
//                                                     variant='contained'
//                                                     color={'inherit'}
//                                                     onClick={() => {
//                                                         setQuestionIndexCurrent(prev => prev < (test.content.length - 1) ? ++prev : prev);
//                                                     }}
//                                                 >
//                                                     Câu hỏi tiếp theo
//                                                 </Button>
//                                             </>
//                                             :
//                                             <>
//                                                 <Box></Box>
//                                                 {
//                                                     showAnswerRight && (questionIndexCurrent === (test.content.length - 1)) ?
//                                                         <LoadingButton
//                                                             variant='contained'
//                                                             loading={openLoading}
//                                                             color='success'
//                                                             onClick={() => {
//                                                                 onSubmitTest();
//                                                             }}
//                                                         >
//                                                             Hoàn thành
//                                                         </LoadingButton>
//                                                         :
//                                                         <Button
//                                                             variant='contained'
//                                                             color='primary'
//                                                             onClick={() => {
//                                                                 if (showAnswerRight) {
//                                                                     setShowAnswerRight(false);
//                                                                     setQuestionIndexCurrent(prev => {

//                                                                         if (selected[prev + 1]) {
//                                                                             delete selected[prev + 1];
//                                                                             setSelected({ ...selected });
//                                                                         }

//                                                                         return prev + 1;
//                                                                     });
//                                                                 } else {
//                                                                     setShowAnswerRight(true);
//                                                                 }
//                                                             }}
//                                                         >
//                                                             {
//                                                                 showAnswerRight ?
//                                                                     'Câu hỏi tiếp theo' :
//                                                                     'Xem đáp án'
//                                                             }
//                                                         </Button>
//                                                 }
//                                             </>
//                                     }
//                                 </Box>
//                                 :
//                                 <></>
//                         }
//                     </>
//             }
//         </Box>
//     </DrawerCustom>
//     )
// }

export default CourseTest