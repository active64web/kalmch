export interface ApiError {
    statusCode: number;
    message: string;
    details?: unknown;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
