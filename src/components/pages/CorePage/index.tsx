// import { delayUntil } from 'helpers/script';
// import { delayUntil } from 'helpers/script';
import { Box } from '@mui/material';
import { toCamelCase } from 'helpers/string';
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

// const templateMap = {
//     Homepage: React.lazy(() => import("./HomePage/index")),
//     About: React.lazy(() => import("./About/index")),
//     Auth: React.lazy(() => import("./Auth/index")),
//     CareerPath: React.lazy(() => import("./CareerPath/index")),
//     Cart: React.lazy(() => import("./Cart/index")),
//     ContactUs: React.lazy(() => import("./ContactUs/index")),
//     Instructor: React.lazy(() => import("./Instructor/index")),
//     Roadmap: React.lazy(() => import("./Roadmap/index")),
//     Terms: React.lazy(() => import("./Terms/index")),
//     User: React.lazy(() => import("./User/index")),
//     Explore: React.lazy(() => import("./Explore/index")),
//     Course: React.lazy(() => import("./Course/index")),
//     Error404: React.lazy(() => import("./Error404")),
// };


function CorePage() {

    const oldComponent = React.useRef<React.ReactNode>(<Box sx={{ height: '300vh' }} />);

    let { page, tab, subtab1, subtab2 } = useParams<{
        page: string,
        tab: string,
        subtab1: string,
        subtab2: string,
    }>();

    return <Suspense fallback={oldComponent.current}>
        {(() => {
            const imported = async () => {
                if (page) {

                    try {
                        let pageCompoment = toCamelCase(page);

                        if (tab && subtab1 && subtab2) {
                            try {
                                const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/' + toCamelCase(subtab2 as string));

                                if (check && typeof check === 'object') {
                                    return check;
                                }

                            } catch (error) {
                                //
                            }
                        }

                        if (tab && subtab1) {

                            try {
                                const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string));

                                if (check && typeof check === 'object') {
                                    return check;
                                }

                            } catch (error) {
                                //
                            }

                        }


                        if (tab) {
                            try {
                                const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string));

                                if (check && typeof check === 'object') {
                                    return check;
                                }
                            } catch (error) {
                                //
                            }
                        }


                        try {
                            const check = await import('./' + pageCompoment);

                            if (check && typeof check === 'object') {
                                return check;
                            }

                        } catch (error) {
                            //
                        }


                    } catch (error) {
                        //
                    }

                    return import("./Error404");

                }

                return import("./HomePage/index");
            };


            const Component = React.lazy(() => imported());
            return <Component />
        })()}
    </Suspense>

}

export default CorePage


// async function getComponent(page?: string, tab?: string, subtab1?: string, subtab2?: string) {
//     if (page) {

//         try {
//             let pageCompoment = toCamelCase(page);

//             if (tab && subtab1 && subtab2) {
//                 try {
//                     const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/' + toCamelCase(subtab2 as string));

//                     if (check && typeof check === 'object') {
//                         const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string) + '/' + toCamelCase(subtab2 as string)));
//                         return <Component />
//                     }

//                 } catch (error) {
//                     //
//                 }
//             }


//             if (tab && subtab1) {

//                 try {
//                     const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string));

//                     if (check && typeof check === 'object') {
//                         const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string) + '/' + toCamelCase(subtab1 as string)));
//                         return <Component />
//                     }

//                 } catch (error) {
//                     //
//                 }

//             }


//             if (tab) {
//                 try {
//                     const check = await import('./' + pageCompoment + '/' + toCamelCase(tab as string));

//                     if (check && typeof check === 'object') {
//                         const Component = React.lazy(() => import('./' + pageCompoment + '/' + toCamelCase(tab as string)));
//                         return <Component />
//                     }
//                 } catch (error) {
//                     //
//                 }
//             }


//             try {
//                 const check = await import('./' + pageCompoment);

//                 if (check && typeof check === 'object') {
//                     const Component = React.lazy(() => import('./' + pageCompoment));
//                     return <Component />
//                 }

//             } catch (error) {
//                 //
//             }


//         } catch (error) {
//             //
//         }

//         return <Error404 />

//     }

//     return <Homepage />

// }