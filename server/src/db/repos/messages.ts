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

  addMessage(values: { userId: string; groupId: number; message: string }) {
    return this.db.one(queries.messages.add, values);
  }

  deleteMessage(values: { id: number }) {
    return this.db.none(queries.messages.delete, values);
  }

  getMessages(values: { groupId: number }) {
    return this.db.any(queries.messages.get, values);
  }

  findById(value: {id:number}){
    return this.db.one(queries.messages.findById,value)
  }
}

export default MessagesRepositiory;
