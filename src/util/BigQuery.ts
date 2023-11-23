import { BigQuery as _BigQuery } from "@google-cloud/bigquery";

/**
 * @description -> Defines a number od instance methods to interact with bigquery database
 */
class BigQuery extends _BigQuery {
  /**
   * @description -> Creates an instance of Bq.
   */
  static project_Id: string = process.env.PROJECT_ID as string;

  constructor() {
    super({
      projectId: BigQuery.project_Id,
    });
  }

  /**
   * @description -> async instance method to get trace log
   */
  async getTraceLog(traceId: string) {
    try {
      const sql = `SELECT * FROM \`${BigQuery.project_Id}.App_Activity.logs\` 
                            WHERE traceId="${traceId}"`;
      const [[data]] = await this.query(sql);
      if (!data)
        return {
          message: "No trace found",
          suggestion: "Please check the traceId or try again in a minute",
        };
      if (data.body) {
        data.body = JSON.parse(data.body);
      }
      if (data.headers) {
        data.headers = JSON.parse(data.headers);
      }
      if (data.params) {
        data.params = JSON.parse(data.params);
      }
      if (data.query) {
        data.query = JSON.parse(data.query);
      }
      if (data.data) {
        data.data = JSON.parse(data.data);
      }
      if (data.operationData) {
        data.operationData = JSON.parse(data.operationData);
      }
      if (data.error) {
        data.error = JSON.parse(data.error);
      }
      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export default new BigQuery();
