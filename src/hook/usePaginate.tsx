import { Pagination } from '@mui/material';
import TablePagination, { PaginationProps } from 'components/atoms/TablePagination';
import React from 'react';
import useQuery from './useQuery';

function usePaginate<T>({ name, pagination, rowsPerPageOptions = [5, 10, 15, 20, 25, 50], data, onChange, isChangeUrl = true, enableLoadFirst = false, scrollToELementAfterChange, template = 'advance' }: {
    name: string,
    pagination: PaginationProps<T> | null,
    rowsPerPageOptions?: Array<number>,
    data: {
        [key: string]: ANY,
        current_page: number,
        per_page: number,
    },
    isChangeUrl?: boolean,
    enableLoadFirst?: boolean,
    onChange: (data: { [key: string]: ANY, current_page: number, per_page: number }) => Promise<ANY>,
    scrollToELementAfterChange?: React.RefObject<HTMLElement>,
    template?: 'advance' | 'page' | 'simple',
}): UsePaginateProps {

    const paginateFormUrl = useQuery({
        [name + '_current_page']: data.current_page,
        [name + '_per_page']: data.per_page,
    })

    const [isLoading, setIsLoading] = React.useState(enableLoadFirst);

    const [paginateConfig, setPaginateConfig] = React.useState<{
        [key: string]: ANY,
        current_page: number,
        per_page: number,
        loadData?: boolean,
    }>({
        ...data,
        current_page: Number(pagination ? pagination.current_page : paginateFormUrl.query[name + '_current_page']) ?? 0,
        per_page: Number(pagination ? pagination.per_page : paginateFormUrl.query[name + '_per_page']) ?? rowsPerPageOptions[0]
    });

    React.useEffect(() => {
        if (paginateConfig.loadData || pagination || enableLoadFirst) {
            setIsLoading(true);

            if (isChangeUrl) {

                if ((paginateFormUrl.query[name + '_current_page'] + '') !== (paginateConfig.current_page + '')
                    || (paginateFormUrl.query[name + '_per_page'] + '') !== ('' + paginateConfig.per_page)) {

                    paginateFormUrl.changeQuery({
                        [name + '_current_page']: paginateConfig.current_page,
                        [name + '_per_page']: paginateConfig.per_page,
                    })
                }
            }

            (async () => {
                await onChange(paginateConfig);

                if (pagination && scrollToELementAfterChange) {
                    scrollToELementAfterChange.current?.scrollIntoView({ behavior: "smooth" });
                }
                setIsLoading(false);
            })()
        }
    }, [paginateConfig]);

    React.useEffect(() => {
        if (isChangeUrl) {
            if ((paginateFormUrl.query[name + '_current_page'] + '') !== (paginateConfig.current_page + '')
                || (paginateFormUrl.query[name + '_per_page'] + '') !== ('' + paginateConfig.per_page)) {
                setPaginateConfig(prev => ({
                    ...prev,
                    current_page: Number(paginateFormUrl.query[name + '_current_page']) ?? 0,
                    per_page: Number(paginateFormUrl.query[name + '_per_page']) ?? rowsPerPageOptions[0]
                }));
            }
        }
    }, [paginateFormUrl.query[name + '_current_page'], paginateFormUrl.query[name + '_per_page']]);

    return {
        isLoading: isLoading,
        data: paginateConfig,
        set: setPaginateConfig,
        component: pagination && pagination.total > 0 ? (
            template === 'advance' ? <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                count={pagination.total}
                rowsPerPage={Number(paginateConfig.per_page)}
                page={paginateConfig.current_page > 1 ? paginateConfig.current_page - 1 : 0}
                onPageChange={(_event, page) => {

                    if (isChangeUrl) {
                        paginateFormUrl.changeQuery({
                            [name + '_current_page']: page + 1
                        });
                    } else {
                        setPaginateConfig(prev => ({
                            ...prev,
                            current_page: page + 1
                        }));
                    }
                }}
                onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (isChangeUrl) {
                        paginateFormUrl.changeQuery({
                            [name + '_current_page']: parseInt(event.target.value) * (Number(paginateFormUrl.query[name + '_current_page'] ?? 0) - 1) < pagination.total ? paginateFormUrl.query[name + '_current_page'] : 1,
                            [name + '_per_page']: parseInt(event.target.value),
                        })
                    } else {
                        setPaginateConfig((prev) => ({
                            current_page: parseInt(event.target.value) * (prev.current_page - 1) < pagination.total ? prev.current_page : 1,
                            per_page: parseInt(event.target.value)
                        }));
                    }
                }}
            />
                :
                template === 'page' ?
                    pagination.last_page > 1 ?
                        <Pagination
                            count={pagination.last_page}
                            showFirstButton
                            showLastButton
                            page={Number(paginateConfig.current_page) > 0 ? Number(paginateConfig.current_page) : 1}
                            onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                                if (isChangeUrl) {
                                    paginateFormUrl.changeQuery({
                                        [name + '_current_page']: value
                                    });
                                } else {
                                    setPaginateConfig(prev => ({
                                        ...prev,
                                        current_page: value
                                    }));
                                }
                            }}
                        />
                        :
                        <></>
                    :
                    <></>

        ) : null
    }
}

export default usePaginate

export interface UsePaginateProps {
    isLoading: boolean,
    data: {
        [key: string]: ANY,
        current_page: number;
        per_page: number;
    },
    set: React.Dispatch<React.SetStateAction<{
        [key: string]: ANY,
        current_page: number;
        per_page: number;
        loadData?: boolean,
    }>>,
    component: JSX.Element | null
}