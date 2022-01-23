import {Handler} from "express";

export interface MiddlewareCases {
  handler: Handler;
  before?: Handler[];
  after?: Handler[];
  success?: Handler[];
  fail?: Handler[];
}
