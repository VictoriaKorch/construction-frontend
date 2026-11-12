/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterUserDto {
  /**
   * Логин пользователя (минимум 3 символа)
   * @example "v.korchagina"
   */
  username: string;
  /**
   * Пароль пользователя (минимум 4 символа)
   * @example "pass1234"
   */
  password: string;
}

export interface CreateConstructionDto {
  /**
   * Название строительной услуги
   * @example "Проектирование инженерных сетей"
   */
  title: string;
}

export interface UpdateConstructionDto {
  /** @example "Проектирование инженерных сетей" */
  title?: string;
  /** @example "Выполнение расчетов и прокладка сетей" */
  description?: string;
  /** @example 150000 */
  price?: number;
  /** @example 120 */
  area?: number;
}

export interface LikeDto {
  /**
   * 0 - удалить лайк, 1 - поставить лайк
   * @example 1
   */
  action: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Construction API
 * @version 1.0.0
 * @contact
 *
 * Система заявок на строительные услуги.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Users
     * @name AuthControllerRegister
     * @summary Регистрация нового пользователя (создателя)
     * @request POST:/api/users/register
     */
    authControllerRegister: (
      data: RegisterUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AuthControllerLogin
     * @summary Аутентификация пользователя (создание сессии)
     * @request POST:/api/users/login
     */
    authControllerLogin: (data: RegisterUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AuthControllerLogout
     * @summary Выход из аккаунта (удаление сессии)
     * @request POST:/api/users/logout
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Constructions
     * @name ConstructionControllerGetList
     * @summary Получение списка опубликованных услуг с фильтрацией
     * @request GET:/api/construction
     */
    constructionControllerGetList: (
      query?: {
        /** Минимальная стоимость услуги */
        minPrice?: number;
        /** Максимальная стоимость услуги */
        maxPrice?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/construction`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Constructions
     * @name ConstructionControllerCreateService
     * @summary Добавление новой услуги (черновика) с медиа
     * @request POST:/api/construction
     */
    constructionControllerCreateService: (
      data: CreateConstructionDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/construction`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Constructions
     * @name ConstructionControllerGetFeed
     * @summary Получение ленты (открытие карточки или следующей)
     * @request GET:/api/construction/feed
     */
    constructionControllerGetFeed: (
      query: {
        id: string;
        next: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/construction/feed`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Constructions
     * @name ConstructionControllerGetDraft
     * @summary Получение черновика авторизованного пользователя
     * @request GET:/api/construction/draft
     */
    constructionControllerGetDraft: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/construction/draft`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Constructions
     * @name ConstructionControllerPublishService
     * @summary Публикация черновика услуги
     * @request PUT:/api/construction/{id}/publish
     */
    constructionControllerPublishService: (
      id: number,
      data: UpdateConstructionDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/construction/${id}/publish`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Constructions
     * @name ConstructionControllerDeleteService
     * @summary Логическое удаление услуги
     * @request DELETE:/api/construction/{id}
     */
    constructionControllerDeleteService: (
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/construction/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Constructions
     * @name ConstructionControllerHandleLike
     * @summary Управление лайками (0 или 1)
     * @request POST:/api/construction/{id}/like
     */
    constructionControllerHandleLike: (
      id: number,
      data: LikeDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/construction/${id}/like`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
