import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory.js";

const sendNotification = (
    newNotification:{
        friendId?:string,
        groupId?:string,
        notificationType: string

    }
) =>{
    return db.tx(async t =>{
        

    })
}