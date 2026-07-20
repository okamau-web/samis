export interface ApiResponse<T> {

    success: boolean;

    message: string;

    data: T;

    count?: number;

    page?: number;

    limit?: number;

    total?: number;

    totalPages?: number;

}