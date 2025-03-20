const sql = require("mssql/msnodesqlv8");
const getPool = require("../database/lazyConn");
const { VarChar } = require("msnodesqlv8");

const addUser = async (user) => {
  let pool;
  try {
    const { nanoid } = await import("nanoid");
    const id = nanoid();

    pool = await getPool();

    const isMatched = await getUser(user.email);
    if (isMatched.exists == true) {
      console.log("User Already Exists");
      return { error: true, message: "User already exists" };
    }

    await pool
      .request()
      .input("ID", sql.VarChar, id)
      .input("F_NAME", sql.VarChar, user.fName)
      .input("L_NAME", sql.VarChar, user.lName)
      .input("EMAIL", sql.VarChar, user.email)
      .input("password", sql.VarChar, user.password)
      .input("PUBLIC_KEY", sql.VarChar, user.publicKey)
      .query(`INSERT INTO USERS (ID, F_NAME, L_NAME, EMAIL, PASSWORD, PUBLIC_KEY)
                    VALUES (@ID, @F_NAME, @L_NAME, @EMAIL, @password, @PUBLIC_KEY)`);

    console.log("User Added Successfully");
    return { error: false, message: "User added successfully" };
  } catch (err) {
    console.error("Error Adding User:", err);
    return { error: true, message: "Failed to add user", details: err.message };
  } /* finally {
        if (pool) await pool.close();
    } */
};

const userState = async (email, lastSeen) => {
  let pool;
  try {
    pool = await getPool(); // Ensure getPool is correctly defined and returns a connection pool.

    await pool
      .request()
      .input("lastSeen", sql.VarChar, lastSeen)
      .input("email", sql.VarChar, email).query(`
                UPDATE USERS
                SET LAST_SEEN = @lastSeen
                WHERE EMAIL = @email
            `);

    console.log("User state updated successfully");
  } catch (err) {
    console.error("Error updating user state:", err);
    throw new Error("Database query failed (user-state)");
  } /* finally {
        if (pool) await pool.close();
    } */
};

const setSocketId = async (email, socket_id) => {
  let pool;
  try {
    pool = await getPool();
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("SOCKET_ID", sql.VarChar, socket_id).query(`UPDATE USERS
            SET SOCKET_ID=@SOCKET_ID
            WHERE EMAIL = @email `);

    console.log("User updated successfully");
  } catch (err) {
    console.error("Error updating socket_id:", err);
    throw new Error("Database query failed");
  } /* finally{
        if(pool){
            await pool.close();
        }
    } */
};

const getUser = async (email) => {
  let pool;
  try {
    pool = await getPool();
    console.log("Database pool initialized successfully");

    const result = await pool.request().input("email", sql.VarChar, email)
      .query(`
                SELECT ID, F_NAME, L_NAME, EMAIL, PASSWORD,SOCKET_ID
                FROM USERS
                WHERE EMAIL = @email
            `);

    if (result.recordset.length === 0) {
      return { exists: false };
    }
    await userState(email, "online");
    return { exists: true, info: result.recordset[0] };
  } catch (err) {
    console.error("Error fetching user:", err);
    throw new Error("Database query failed");
  } /* finally {
        if (pool) await pool.close();
    } */
};
/* getUser("arianajohns@gmail.com")
    .then(user => console.log(user))
    .catch(error => console.error("Error fetching user:", error)); */

const getUserConversations = async (id) => {
  let pool;
  try {
    pool = await getPool();
    const result_con = await pool.request().input("ID", sql.VarChar, id).query(`
        SELECT PARTICIPENT_1,PARTICIPENT_2,ID,MESSAGES FROM CONVERSATIONS
        WHERE PARTICIPENT_1=@ID OR PARTICIPENT_2=@ID
        `);

    if (result_con.recordset.length == 0) {
      return { exists: false };
    }
    let conversation = [];
    /*  const result = await pool
      .request()
      .input("ID", sql.VarChar, result_con.recordset).query(`
        SELECT [CHAT_ID],[MESSAGE],[TIME_STAMP],[RECEIVER_ID] FROM MESSAGES
        WHERE [CHAT_ID] IN (
                SELECT [MESSAGES]
                FROM CONVERSATIONS
                WHERE [PARTICIPENT_1] = @ID OR [PARTICIPENT_2]=@ID
    );`);
 */

    for (let i = 0; i < result_con.recordset.length; i++) {
      let receiver;
      let sender;
      if (result_con.recordset[i].PARTICIPENT_1 == id) {
        sender = result_con.recordset[i].PARTICIPENT_1;
        receiver = result_con.recordset[i].PARTICIPENT_2;
      } else {
        if (result_con.recordset[i].PARTICIPENT_2 == id) {
          sender = result_con.recordset[i].PARTICIPENT_2;
          receiver = result_con.recordset[i].PARTICIPENT_1;
        } else {
          continue;
        }
      }
      const result = await pool
        .request()
        .input("ID", sql.VarChar, result_con.recordset[i].MESSAGES).query(`
        SELECT [CHAT_ID],[MESSAGE],[TIME_STAMP] FROM MESSAGES
        WHERE [CHAT_ID] = @ID
    `);

      let message;
      if (result.recordset.length !== 0) {
        message = { MESSAGE: result.recordset[0].MESSAGE.slice(0, 10) };
      }
      const result_2 = await pool.request().input("ID", sql.VarChar, receiver)
        .query(`
                    SELECT F_NAME,L_NAME FROM USERS
                    WHERE ID= @ID
                `);
      let name = {
        RECEIVER_NAME: `${result_2.recordset[0].F_NAME} ${result_2.recordset[0].L_NAME}`,
      };

      const obj = await {
        ...{
          ID: result_con.recordset[i].ID,
          SENDER_ID: sender,
          RECEIVER_ID: receiver,
        },
        ...result.recordset[0],
        ...name,
        ...message,
      };
      conversation.push(obj);
    }
    return { exists: true, conversations: conversation };
  } catch (err) {
    console.error("Error fetching user:", err);
    throw new Error("Database query failed");
  }
};

const checkUserConversation = async (sender_id, receiver_id) => {
  let pool;
  try {
    pool = await getPool();
    const request = await pool
      .request()
      .input("SENDER_ID", sql.VarChar, sender_id)
      .input("RECEIVER_ID", sql.VarChar, receiver_id).query(`
      SELECT * FROM CONVERSATIONS
      WHERE (PARTICIPENT_1 = @SENDER_ID AND PARTICIPENT_2 = @RECEIVER_ID) OR (PARTICIPENT_2 = @SENDER_ID AND PARTICIPENT_1 = @RECEIVER_ID)
      `);

    if (request.recordset.length == 0) {
      return { exists: false };
    }

    return { exists: true };
  } catch (err) {
    return { message: "something went wrong in backend/userInfo" };
  }
};

const addUserConversation = async (sender_id, receiver_id, message_id) => {
  let pool;
  try {
    const { nanoid } = await import("nanoid");
    const id = nanoid();

    pool = await getPool();
    const request = await pool
      .request()
      .input("SENDER_ID", sql.VarChar, sender_id)
      .input("RECEIVER_ID", sql.VarChar, receiver_id)
      .input("ID", sql.VarChar, id)
      .input("MESSAGES", sql.VarChar, message_id).query(`
      INSERT INTO CONVERSATIONS (ID,PARTICIPENT_1, PARTICIPENT_2,MESSAGES)
      VALUES (@ID,@SENDER_ID,@RECEIVER_ID,@MESSAGES)
      `);

    return { done: true };
  } catch (err) {
    return {
      message: "something went wrong in backend/userInfo/addUserConversation",
    };
  }
};

const getAllUsers = async (email) => {
  let pool;
  try {
    pool = await getPool();

    const result = await pool.request().input("email", sql.VarChar, email)
      .query(`
            SELECT ID, F_NAME, L_NAME, EMAIL,[DESC] FROM USERS
            WHERE EMAIL != @email
        `);

    if (result.recordset.length === 0) {
      return { info: [] };
    }
    return { info: result.recordset };
  } catch (err) {
    console.error("Error fetching user:", err);
    throw new Error("Database query failed");
  } /* finally {
        if (pool) await pool.close();
    } */
};

const updatePassword = async (id, email,password) => {
  if (!id || !email || !password) return { message: "ID or EMAIL or PASSWORD cannot be Null" };
  let pool;

  try {
    pool = await getPool();

    const request = await pool
      .request()
      .input("ID", sql.VarChar, id)
      .input("EMAIL", sql.VarChar, email)
      .input("PASSWORD", sql.VarChar, password)
      .query(`
        UPDATE USERS
        SET PASSWORD = @PASSWORD
        WHERE ID = @ID AND EMAIL = @EMAIL
      `);

    return {done: true};


  } catch (err) {
    return {done:false, message: err.message};
  }
};

module.exports = {
  addUser,
  getUser,
  getAllUsers,
  setSocketId,
  getUserConversations,
  checkUserConversation,
  addUserConversation,
  updatePassword,
};
