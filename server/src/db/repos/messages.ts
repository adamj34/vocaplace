import { IDatabase, IMain } from "pg-promise";
import { pgp } from "../connection/db";
import queries from "../sql/sqlQueries";

class MessagesRepositiory {
  db: IDatabase<any>;
  pgp: IMain;

  constructor(db: IDatabase<any>, pgp: IMain) {
    this.db = db;
    this.pgp = pgp;
  }

  addMessage(values: { userId: string; groupId: string; message: string }) {
    return this.db.one(queries.messages.add, values);
  }

  deleteMessage(values: { id: string }) {
    return this.db.none(queries.messages.delete, values);
  }

  getMessages(values: { groupId: string }) {
    return this.db.any(queries.messages.get, values);
  }
}

export default MessagesRepositiory;
