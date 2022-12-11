import { Pagination } from '@mui/material';
import TablePagination, { PaginationProps } from 'components/atoms/TablePagination';
import { getParamsFromUrl, getUrlParams, replaceUrlParam } from 'helpers/url';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function usePaginate<T>({ name, pagination, rowsPerPageOptions = [5, 10, 15, 20, 25, 50], data, onChange, isChangeUrl = true, enableLoadFirst = false, scrollToELementAfterChange, template = 'advance' }: {
    name: string,
    pagination: PaginationProps<T> | null,
    rowsPerPageOptions?: Array<number>,
    data: {
        current_page: number,
        per_page: number,
    },
    isChangeUrl?: boolean,
    enableLoadFirst?: boolean,
    onChange: ({ current_page, per_page }: { current_page: number, per_page: number }) => Promise<ANY>,
    scrollToELementAfterChange?: React.RefObject<HTMLElement>,
    template?: 'advance' | 'page' | 'simple',
}): UsePaginateProps {

    const paginateFormUrl = getUrlParams(window.location.search, {
        [name + '_current_page']: data.current_page,
        [name + '_per_page']: data.per_page,
    })

    const [isLoading, setIsLoading] = React.useState(enableLoadFirst);

    const [paginateConfig, setPaginateConfig] = React.useState<{
        current_page: number,
        per_page: number,
        loadData?: boolean,
    }>({
        current_page: Number(pagination ? pagination.current_page : paginateFormUrl[name + '_current_page']) ?? 0,
        per_page: Number(pagination ? pagination.per_page : paginateFormUrl[name + '_per_page']) ?? rowsPerPageOptions[0]
    });

    const navigate = useNavigate();

    React.useEffect(() => {
        if (paginateConfig.loadData || pagination || enableLoadFirst) {
            setIsLoading(true);

            if (isChangeUrl) {

                if ((data.current_page + '') !== (paginateConfig.current_page + '') || (data.per_page + '') !== ('' + paginateConfig.per_page)) {
                    navigate('?' + getParamsFromUrl(replaceUrlParam(window.location.href, {
                        [name + '_current_page']: paginateConfig.current_page,
                        [name + '_per_page']: paginateConfig.per_page,
                    })));
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
                    setPaginateConfig(prev => ({
                        ...prev,
                        current_page: page + 1
                    }));
                }}
                onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    setPaginateConfig((prev) => ({
                        current_page: parseInt(event.target.value) * (prev.current_page - 1) < pagination.total ? prev.current_page : 1,
                        per_page: parseInt(event.target.value)
                    }));
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
                                setPaginateConfig(prev => ({
                                    ...prev,
                                    current_page: value
                                }));
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
        current_page: number;
        per_page: number;
    },
    set: React.Dispatch<React.SetStateAction<{
        current_page: number;
        per_page: number;
        loadData?: boolean,
    }>>,
    component: JSX.Element | null
}