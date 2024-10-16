import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import AbstractHttpClient, { IRequestConfig } from './abstractHttpClient';

export class AxiosHttpClient extends AbstractHttpClient {
    protected axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        super(baseURL);

        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async request<T>({ method, url, params, data, schema, headers }: IRequestConfig<T>): Promise<T> {
        try {
            const response = await this.axiosInstance.request({
                method,
                url,
                params,
                data,
                headers,
            });

            // if (schema) {
            //     return schema.parse(response.data);
            // }

            return response.data as T;
        } catch (error) {
            if (error instanceof AxiosError) {
                // Manejo de errores específicos de Axios
                if (error.response) {
                    throw new Error(`Request failed with status ${error.response.status}: ${error.response.data}`);
                } else if (error.request) {
                    throw new Error('No response received from the server');
                } else {
                    throw new Error('Error setting up the request');
                }
            }
            throw error;
        }
    }

}

