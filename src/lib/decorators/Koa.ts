import BodyParser from "koa-bodyparser";
import Router, {Layer} from "koa-router";
import Koa, {Context, Next} from "koa";

import {ExpressionHandler} from "../../module/api/rest/middleware/ExpressionHandler";
import {MiddlewareCases} from "../interfaces/Koa";
import {debug, error} from "../utils/logger/lib";

import Params from "./../../lib/utils/config/Params";
import {Promise} from "../utils/promise";

const key = Symbol("koa");
const koa:
    | {
    [key: string]: {
        app: Koa;
        router: { [key: string]: Router };
    };
}
    | any = {[key]: {}};

export function KoaApi<T extends new (...args: any[]) => any>(constructor: T) {
    koa[key].app = new Koa();
    constructor.prototype.koa = koa[key].app;
    queueMicrotask(() => ImplRoutes(constructor, koa[key]));
}


export function Presenter(options: { path: string | string[] }) {
    if (!koa[key].router) {
        koa[key].router = {};
    }
    return function <T extends { new(...args: any[]): any }>(constructor: T) {
        koa[key].router[constructor.name] = {
            path: options.path,
            route: new Router()
        };
        for (let name in constructor.prototype.routes) {
            let instance = new (constructor as any)();
            BuildPresenter(instance, constructor, koa[key].router[constructor.name].route, name)
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

function ImplRoutes(constructor, koa) {
    koa.app.use(ExpressionHandler);
    koa.app.use(BodyParser());

    const appRouter = new Router();
    const commonRouter = new Router();

    for (let name in koa.router) {
        const [baseRouter, router] = [new Router(), koa.router[name]];
        baseRouter.use(router.path, router.route.routes(), router.route.allowedMethods());
        commonRouter.use(baseRouter.routes(), router.route.allowedMethods());
    }

    appRouter.use(`/${Params.api_endpoint}/${Params.api_version}`, commonRouter.routes());
    koa.app.use(appRouter.routes());
    appRouter.stack.forEach((value: Layer) => debug(["route", {
        methods: value.methods,
        path: value.path,
        stacks: value.stack.length
    }]));
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
        ...(route.after?.length && route.after || []),
        koa[key].router[constructor.name].route.allowedMethods()
    ].filter((value) => value));
}

async function Handler(middlewareList: MiddlewareCases, ...args: any[]): Promise<any>;
async function Handler(middlewareList: MiddlewareCases, context: Context, next: Next): Promise<any> {
    try {
        await middlewareList.handler(context, next);
        Promise.each(middlewareList.success, (middleware) => middleware(context, next))
    } catch (err) {
        error(err);
        Promise.each(middlewareList.fail, (middleware) => middleware(context, next))
        throw err;
    }
}
