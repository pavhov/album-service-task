import Express from "express";
import listEndpoints from "express-list-endpoints";

import {Error404Handler, ExpressionHandler} from "../../module/api/rest/middleware/ExpressionHandler";
import {MiddlewareCases} from "../interfaces/Express";
import {debug, error} from "../utils/logger/lib";

import Params from "./../../lib/utils/config/Params";
import {Promise} from "../utils/promise";

const key = Symbol("express");
const express:
    | {
    [key: string]: {
        app: Express.Application;
        router: { [key: string]: Express.Router };
    };
} | any = {[key]: {}};

export function ExpressApi<T extends new (...args: any[]) => any>(constructor: T) {
    express[key].app = Express();
    constructor.prototype.express = express[key].app;
    queueMicrotask(() => ImplRoutes(constructor, express[key]));
}


export function Presenter(options: { path: string | string[] }) {
    if (!express[key].router) {
        express[key].router = {};
    }
    return function <T extends { new(...args: any[]): any }>(constructor: T) {
        express[key].router[constructor.name] = {
            path: options.path,
            route: Express.Router()
        };
        for (let name in constructor.prototype.routes) {
            let instance = new (constructor as any)();
            BuildPresenter(instance, constructor, express[key].router[constructor.name].route, name)
        }
    };
}


export function Use(middleware: any | any[]) {
    return function (target: any, propertyName: string) {
        Middleware("before", target, propertyName, middleware);
        Middleware("after", target, propertyName, middleware);
        Middleware("success", target, propertyName, middleware);
        Middleware("fail", target, propertyName, middleware);
    };
}

export function Before(fn: any | any[]) {
    return function (target: any, propertyName: string) {
        return Middleware("before", target, propertyName, fn);
    };
}

export function After(fn: any | any[]) {
    return function (target: any, propertyName: string) {
        return Middleware("after", target, propertyName, fn);
    };
}


export function Get(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("get", target, propertyName, descriptor.value, options);
    };
}

export function Post(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("post", target, propertyName, descriptor.value, options);
    };
}

export function Put(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("put", target, propertyName, descriptor.value, options);
    };
}

export function Patch(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("patch", target, propertyName, descriptor.value, options);
    };
}

export function Header(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        return Method("header", target, propertyName, descriptor.value, options);
    };
}

export function Delete(options?: { path?: string }) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        Method("delete", target, propertyName, descriptor.value, options);
    };
}


function Middleware(name: string, target: any, propertyName: string, handler: any) {
    !target.routes && (target.routes = {});
    !target.routes[propertyName] && (target.routes[propertyName] = {});
    !target.routes[propertyName][name] && (target.routes[propertyName][name] = []);

    const instance = handler.Instance();
    instance[name] && (target.routes[propertyName][name].unshift(instance[name].bind(instance)));
}

function Method(name: string, target: any, propertyName: string, handler: any, options: any) {
    if (!target.routes) {
        target.routes = {};
    }
    target.routes[propertyName] = {
        ...target.routes[propertyName],
        path: propertyName,
        method: name,
        handler,
        ...options
    };
}

function ImplRoutes(constructor, express) {
    express.app.use(Express.json({}));
    express.app.use(Express.query({}));
    express.app.use(Express.text({}));
    express.app.use(Express.raw({}));

    const appRouter = Express.Router();
    const commonRouter = Express.Router();

    for (let name in express.router) {
        const router = express.router[name];
        commonRouter.use(router.path, router.route);
    }

    appRouter.use(`/${Params.api_endpoint}/${Params.api_version}`, commonRouter);
    express.app.use("/", appRouter);
    express.app.use(Error404Handler);
    express.app.use(ExpressionHandler);

    listEndpoints(express.app).forEach((value) => debug(["route", value]));
}

function BuildPresenter(instance, constructor, routes, name) {
    let route: {path: string; method: string;} & MiddlewareCases = instance.routes[name];
    const middlewareList = {
        handler: route.handler.bind(instance),
        success: (route.success?.length && route.success || []),
        fail: (route.fail?.length && route.fail || [])
    } as MiddlewareCases;
    routes[route.method](...[
        route.path,
        ...(route.before?.length && route.before || []),
        (...args: any[]) => Handler(middlewareList, ...args),
        ...(route.after?.length && route.after || [])
    ].filter((value) => value));
}

async function Handler(middlewareList: MiddlewareCases, ...args: any[]): Promise<any>;
async function Handler(middlewareList: MiddlewareCases, req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<any> {
    try {
        await middlewareList.handler(req, res, next);
        Promise.each(middlewareList.success, (middleware) => middleware(req, res, next))
    } catch (err) {
        error(err);
        Promise.each(middlewareList.fail, (middleware) => middleware(req, res, next))
        throw err;
    }
}
