import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import AbstractHttpClient, { IRequestConfig } from './abstractHttpClient';
import { getSession, signOut } from 'next-auth/react';

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

  //   private setupInterceptors() {
  //     this.axiosInstance.interceptors.request.use(
  //       async (config: InternalAxiosRequestConfig) => {
  //         const session = await getSession();
  //         if (session?.user?.accessToken) {
  //           config.headers['Authorization'] =
  //             `Bearer ${session.user.accessToken}`;
  //         }
  //         return config;
  //       },
  //       (error) => Promise.reject(error)
  //     );

  //     this.axiosInstance.interceptors.response.use(
  //       (response) => response,
  //       async (error: AxiosError) => {
  //         const originalRequest = error.config as InternalAxiosRequestConfig & {
  //           _retry?: boolean;
  //         };
  //         if (error.response?.status === 401 && !originalRequest._retry) {
  //           originalRequest._retry = true;

  //           try {
  //             // Attempt to refresh the session
  //             await signOut({ redirect: false });
  //             const newSession = await getSession();

  //             if (newSession?.user?.accessToken) {
  //               originalRequest.headers['Authorization'] =
  //                 `Bearer ${newSession.user.accessToken}`;
  //               return this.axiosInstance(originalRequest);
  //             }
  //           } catch (refreshError) {
  //             // If refresh fails, sign out the user
  //             await signOut({ callbackUrl: '/auth/signin' });
  //             return Promise.reject(refreshError);
  //           }
  //         }
  //         return Promise.reject(error);
  //       }
  //     );
  //   }

  async request<T>({
    method,
    url,
    params,
    data,
    schema,
    headers,
  }: IRequestConfig<T>): Promise<T> {
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
          throw new Error(
            `Request failed with status ${error.response.status}: ${error.response.data}`
          );
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
