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

  addNotification(values: { userId: string; senderId?: string; group_id?:string; notification_type: string }) {
     return this.db.one(queries.notifications.add, values);
}

  deleteNotification(values: { id: string }) {
    return this.db.none(queries.notifications.delete, values);
  }

  deleteAllNotifications(values: { userId: string }) {
    return this.db.none(queries.notifications.deleteAll, values);
    }

    getNotifications(values: { userId: string }) {
        return this.db.any(queries.notifications.get, values);
    }

    markAsRead(values: { id: string }) {
        return this.db.none(queries.notifications.markAsRead, values);
    }

    markAllAsRead(values: { userId: string }) {
        return this.db.none(queries.notifications.markAllAsRead, values);
    }



}

export default NotificationsRepositiory;
