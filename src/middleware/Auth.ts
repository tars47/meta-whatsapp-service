import { type NextFunction, type Request, type Response } from "express";
import { type TypedResponse } from "../controllers/types/TypedReqRes";
import { HttpError } from "../util/HttpError";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import path from "path";
const cert = require(path.join(
  __dirname,
  `../../certificates/${process.env.FIRESTORE_CERT_FILE_NAME}`
));
const firebase = admin.initializeApp({ credential: admin.credential.cert(cert) });

/**
 *  @description -> Class that checks if the request has a valid api key
 */
class ApiKeyStrategy {
  public verify(req: Request, _: Response, next: NextFunction): void {
    const validApikey = process.env.API_KEY as string;
    const clientApikey = req.headers["x-api-key"];
    if (!clientApikey) {
      const error = new Error("x-api-key required to access this route");
      next(new HttpError(error, 401));
    } else if (clientApikey !== validApikey) {
      const error = new Error("x-api-key is invalid");
      next(new HttpError(error, 401));
    } else {
      next();
    }
  }
}

class FirebaseAuthStrategy {
  public verify(req: Request, res: TypedResponse, next: NextFunction): void {
    let token = req.headers.authorization;
    if (!token) {
      const error = new Error("Authorization token required to access this route");
      return next(new HttpError(error, 401));
    } else {
      let [bearer, userToken] = token.split(" ");
      if (bearer !== "Bearer" || !userToken) {
        const error = new Error("Authorization token is invalid");
        return next(new HttpError(error, 401));
      }
      getAuth(firebase)
        .verifyIdToken(userToken)
        .then(decodedToken => {
          res.locals.merchant = decodedToken;
          next();
        })
        .catch(error => {
          next(new HttpError(error, 401));
        });
    }
  }
}

/**
 *  @description -> Class that contains all the auth strategies
 */
export default class Auth {
  static ApiKeyStrategy = ApiKeyStrategy;
  static FirebaseAuthStrategy = FirebaseAuthStrategy;
}
