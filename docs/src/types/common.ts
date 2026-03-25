export interface IAxiosResponse<T = unknown> {
    meta: IMeta;
    data: T;
}

export interface IPaginationResponse<T = unknown> {
    data: T;
    pagination: IPaginationMeta;
}

export interface IMeta {
    code: number;
    message: string | string[];
    exception: string;
    path: string;
}

export interface IPaginationMeta extends IPageParams {
    totalItems: number;
    totalPage: number;
}

export interface IPageParams {
    page: number;
    limit: number;
}

export type ISortOrder = 'ASC' | 'DESC';
export type ISortBy = 'createdAt' | 'updatedAt';

