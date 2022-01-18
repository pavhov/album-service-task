import {Middleware} from "express";

export interface MiddlewareCases {
  handler: Middleware;
  before?: Middleware[];
  after?: Middleware[];
  success?: Middleware[];
  fail?: Middleware[];
}
