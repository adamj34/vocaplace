import { IDatabase, IMain } from "pg-promise";
import { pgp } from "../connection/db";
import queries from "../sql/sqlQueries";

class NotificationsRepositiory {
  db: IDatabase<any>;
  pgp: IMain;

  constructor(db: IDatabase<any>, pgp: IMain) {
    this.db = db;
    this.pgp = pgp;
  }

  addNotification(values: { user_id: string; friend_id?: string; group_id?:string; notification_type: string }) {
     return this.db.one(queries.notifications.add, values);
}
