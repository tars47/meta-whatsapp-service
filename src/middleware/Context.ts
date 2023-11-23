import { uuid } from "../util/Crypto";
import { type Request } from "express";
import { type StatusCode } from "./Response";
import Service from "../util/Service";
import { PubSub } from "@google-cloud/pubsub";
import { DecodedIdToken } from "firebase-admin/auth";

const pubsub = new PubSub({
  projectId: process.env.PROJECT_ID,
});
const appActivity = pubsub.topic(`projects/beejek-67764/topics/App_Activity`, {
  batching: {
    maxMessages: 100,
    maxMilliseconds: 5000,
  },
});
/**
 *  @description -> Defines the public contract of the context object (attached to res.locals)
 */
export interface ContextObject {
  reqId: `${string}-${string}-${string}-${string}-${string}`;
  traceId: string;
  ipAddress: string;
  reqdt: string;
  mountPath: string;
  body: string;
  hostName: string;
  headers: string;
  method: string;
  params: string;
  path: string;
  query: string;
  isValidRoute: boolean;
  data: object;
  error: any;
  statusCode: StatusCode;
  serviceName: string;
  operationName: string;
  operationData: object;
  sequenceNumber: number;
  merchant: DecodedIdToken;
  processedIn: number;
  log: () => void;
  save: () => void;
  saveOperation: (operationName: string, operationData: object) => void;
}

/**
 * @description ->  This class is responsible for maintaining context for a given req/res
 *                life cycle, also responsible for saving the context for future analysis.

 */
export class Context implements ContextObject {
  public reqId = uuid();
  public traceId: string;
  public ipAddress: string;
  public reqdt = new Date().toISOString();
  public mountPath: string;
  public body: string;
  public hostName: string;
  public headers: string;
  public method: string;
  public params: string;
  public path: string;
  public query: string;
  public isValidRoute = true;
  public data: object = {};
  public error = null;
  public statusCode: StatusCode = 200;
  public serviceName = Service._name;
  public operationName = "";
  public operationData = {};
  public sequenceNumber = 1;
  public merchant: DecodedIdToken = {} as DecodedIdToken;
  public processedIn = 0;
  /**
   * @description -> Creates an instance of Context.
   */
  constructor(req: Request) {
    this.traceId =
      typeof req.headers["x-trace-id"] === "string" ? req.headers["x-trace-id"] : this.reqId;
    this.ipAddress =
      typeof req.headers["x-forwarded-for"] === "string"
        ? req.headers["x-forwarded-for"]
        : req.socket.remoteAddress ?? "";
    this.mountPath = req.baseUrl;
    this.body = JSON.stringify(req.body);
    this.headers = JSON.stringify(req.headers);
    this.hostName = req.hostname;
    this.method = req.method;
    this.params = JSON.stringify(req.params);
    this.path = req.path;
    this.query = JSON.stringify(req.query);
  }

  /**
   * @description -> logs the context to stdout
   */
  public log(): void {
    console.log("context-->", this);
  }

  /**
   *  @description -> saves the context to bigquery via pubsub
   */
  public save(): void {
    let context: any = { ...this };

    context.data = JSON.stringify(context.data);
    context.error = JSON.stringify(context.error || "");
    context.merchant = JSON.stringify(context.merchant);
    context.operationData = JSON.stringify(context.operationData);

    appActivity
      .publishMessage({ data: Buffer.from(JSON.stringify(context)) })
      .then(results => {
        console.log(`Message ${results} published.`);
      })
      .catch(err => {
        console.error("ERROR while publishing:", err);
      });
  }

  /**
   *  @description -> saves the intermediate operation to bigquery via pubsub
   */
  public saveOperation(operationName: string, operationData: object): void {
    let context: any = { ...this };

    context.operationName = operationName;
    context.data = JSON.stringify(context.data || "");
    context.error = JSON.stringify(context.error || "");
    context.merchant = JSON.stringify(context.merchant);
    context.operationData = JSON.stringify(operationData);

    appActivity
      .publishMessage({ data: Buffer.from(JSON.stringify(context)) })
      .then(results => {
        console.log(`Message ${results} published.`);
      })
      .catch(err => {
        console.error("ERROR while publishing:", err);
      });
  }
}
