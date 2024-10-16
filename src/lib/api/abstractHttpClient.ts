import { z } from 'zod';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IRequestConfig<T> {
    url: string;
    method: RequestMethod;
    schema?: T;
    params?: QueryParams;
    data?: any;
    headers?: Record<string, string>;
}

export interface IHttpClient {
    get<T>(url: string, config?: Omit<IRequestConfig<T>, 'method' | 'url'>): Promise<T>;
    post<T>(url: string, data?: any, config?: Omit<IRequestConfig<T>, 'method' | 'url' | 'data'>): Promise<T>;
    put<T>(url: string, data?: any, config?: Omit<IRequestConfig<T>, 'method' | 'url' | 'data'>): Promise<T>;
    delete<T>(url: string, config?: Omit<IRequestConfig<T>, 'method' | 'url'>): Promise<T>;
    patch<T>(url: string, data?: any, config?: Omit<IRequestConfig<T>, 'method' | 'url' | 'data'>): Promise<T>;
}

export default abstract class AbstractHttpClient implements IHttpClient {
    protected readonly baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    abstract request<T>(config: IRequestConfig<T>): Promise<T>;

    get<T>(url: string, config?: Omit<IRequestConfig<T>, 'method' | 'url'>): Promise<T> {
        return this.request({ ...config, method: 'GET', url });
    }

    post<T>(url: string, data?: any, config?: Omit<IRequestConfig<T>, 'method' | 'url' | 'data'>): Promise<T> {
        return this.request({ ...config, method: 'POST', url, data });
    }

    put<T>(url: string, data?: any, config?: Omit<IRequestConfig<T>, 'method' | 'url' | 'data'>): Promise<T> {
        return this.request({ ...config, method: 'PUT', url, data });
    }

    delete<T>(url: string, config?: Omit<IRequestConfig<T>, 'method' | 'url'>): Promise<T> {
        return this.request({ ...config, method: 'DELETE', url });
    }

    patch<T>(url: string, data?: any, config?: Omit<IRequestConfig<T>, 'method' | 'url' | 'data'>): Promise<T> {
        return this.request({ ...config, method: 'PATCH', url, data });
    }
}