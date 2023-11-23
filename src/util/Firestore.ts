import { Firestore } from "@google-cloud/firestore";
import path from "path";

export default class extends Firestore {
  constructor() {
    super({
      projectId: process.env.PROJECT_ID,
      keyFilename: path.join(__dirname, `../certificates/${process.env.FIRESTORE_CERT_FILE_NAME}`),
    });
  }
}

/**
 * @description
 */
// export default class extends Firestore {
//   constructor() {
//     super({
//       projectId: process.env.PROJECT_ID,
//       keyFilename: path.join(__dirname, `../certificates/${process.env.FIRESTORE_CERT_FILE_NAME}`),
//     });
//   }
// }
// async addlog(id, data) {
//     try {
//       data.dateTime = Firestore.Timestamp.now();
//       data.date = new Date().toISOString().split("T")[0];
//       console.log(data);
//       await this.collection(`${id}/Maverick/Logs`).add(data);
//     } catch (e) {
//       return Promise.reject(e);
//     }
//   }

//   async addAchTransaction(id, data) {
//     try {
//       data.dateTime = Firestore.Timestamp.now();
//       data.date = new Date().toISOString().split("T")[0];
//       await this.collection(`${id}/Maverick/${data.request.transactionType}`).add(data);
//     } catch (e) {
//       return Promise.reject(e);
//     }
//   }

// /**
//  * @description  Defines a number of instance methods to interact with cloud master firestore
//  * @class FireM
//  * @extends {Firestore}
//  */
// class FireM extends Firestore {
//   /**
//    * Creates an instance of FireM.
//    * @memberof FireM
//    */
//   constructor() {
//     super({
//       projectId: process.env.MASTER_PROJECT_ID,
//       keyFilename: path.join(__dirname, `../config/${process.env.MASTER_JSON}`),
//     });
//   }
//   static defaultSgApiKey =
//     "U2FsdGVkX1/c7Uc10lJZ3u9mtrWbqHokEwziBxoLhTb62UZNUP4i1TgRaa7gmq3Ef5zWs3PW+Am0HhOJwQwdoAKo+bIkQQKKHV0Nwc4M2VoJF59oR20djmL13Tpn+p45";

//   /**
//    * @description  async instance method to get the org id for a given project
//    * @param {string} id
//    * @returns {Promise<FireM>}
//    * @memberof FireM
//    */
//   async getOrgId(id) {
//     try {
//       let snap = await this.collection(`${process.env.VERTICAL_MARKET_ID}/Organizations/Organizations`)
//         .where("Associated_Project_Id", "==", id)
//         .get();
//       for (let doc of snap.docs) return doc.id;
//     } catch (e) {
//       return Promise.reject(e);
//     }
//   }

//   /**
//    * @description  async instance method to get the sendgrid main account api key
//    * @returns {Promise<FireM>}
//    * @memberof FireM
//    */
//   async getSgApiKey() {
//     try {
//       let data = await this.doc("Leap360_Twilio_Info/Sg_Apis_Key_For_Stats").get();
//       let info = data.data();
//       if (!info) return FireM.defaultSgApiKey;
//       else return info.Sg_Apis_Key_For_Stats;
//     } catch (e) {
//       return FireM.defaultSgApiKey;
//     }
//   }

//   /**
//    * @description  async instance method to get the twilio api key for a given org id
//    * @param {string} id
//    * @returns {Promise<FireM>}
//    * @memberof FireM
//    */
//   async getTwilioApiKey(id) {
//     const eobj = { msg: "twilio api key not present in master db" };
//     try {
//       let data = await this.doc(`${process.env.VERTICAL_MARKET_ID}/Organizations/Organizations/${id}`).get();
//       let info = data.data();
//       if (!info) return Promise.reject(eobj);
//       else {
//         if (info?.Twilio_Sub_Account_Info?.Sub_Account_Sid && info?.Twilio_Sub_Account_Info?.Sub_Account_Auth_Token)
//           return {
//             sid: info?.Twilio_Sub_Account_Info?.Sub_Account_Sid,
//             token: info?.Twilio_Sub_Account_Info?.Sub_Account_Auth_Token,
//           };
//         else return Promise.reject(eobj);
//       }
//     } catch (e) {
//       return Promise.reject(e);
//     }
//   }

//   /**
//    * @description  async instance method to get the billing price config
//    * @returns {Promise<FireM>}
//    * @memberof FireM
//    */
//   async getBillingCofig() {
//     try {
//       let data = await this.doc("Billing_Config/Billing_Config").get();
//       let info = data.data();
//       if (!info) return Promise.reject({ msg: "billing config not present in master db" });
//       else return info;
//     } catch (e) {
//       return Promise.reject(e);
//     }
//   }
// }
