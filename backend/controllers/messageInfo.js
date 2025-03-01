const sql = require("mssql/msnodesqlv8");
const  getPool  = require("../database/lazyConn");

const uploadMessage = async (messageData) => {
  let pool;
  try {
    pool = await getPool();
    if(!messageData.CHAT_ID){
        return console.log("chatID required: "+messageData.CHAT_ID);
    }
    const request =  await pool
      .request()
      .input("CHAT_ID", sql.VarChar, messageData.CHAT_ID)
      .input("SENDER", sql.VarChar, messageData.SENDER)
      .input("MESSAGE", sql.VarChar, messageData.MESSAGE)
      .input("SENDER_ID", sql.VarChar, messageData.SENDER_ID)
      .input("RECEIVER_ID", sql.VarChar, messageData.RECEIVER_ID)
      .input("TIME_STAMP", sql.DateTime, messageData.TIME_STAMP)
      .query(`INSERT INTO MESSAGES(CHAT_ID,SENDER, MESSAGE, SENDER_ID, RECEIVER_ID, [TIME_STAMP])
            VALUES(@CHAT_ID,@SENDER, @MESSAGE, @SENDER_ID, @RECEIVER_ID, @TIME_STAMP)`);

    console.log("Message Added Successfully");
    return { error: false, message: "Message added successfully" };

  } catch (err) {
    console.error("Error Adding Message:", err);
    return { error: true, message: "Failed to add Message", details: err.message };
  }
};


const getMessage = async (SENDER_ID, RECEIVER_ID) => {
    let pool;
    try {
        pool = await getPool();

        const result = await pool.request()
            .input("SENDER_ID", sql.VarChar, SENDER_ID)
            .input("RECEIVER_ID", sql.VarChar, RECEIVER_ID)
            .query(`
                SELECT * FROM MESSAGES
                WHERE (SENDER_ID = @SENDER_ID AND RECEIVER_ID = @RECEIVER_ID) OR (SENDER_ID = @RECEIVER_ID AND RECEIVER_ID = @SENDER_ID)
                ORDER BY TIME_STAMP
            `);

            console.log("sever side ret: "+result.recordset);
        if (result.recordset.length === 0) {
            return { error: true, data: [], message: "No messages found" };
        }

        console.log("Retrieved messages successfully.");
        return { error: false, data: result.recordset, message: "Got messages"  };
    } catch (err) {
        console.error("Error retrieving messages: " + err.message);
        return { error: true, data: [], message: "An error occurred while fetching messages." };
    }
};

module.exports = {uploadMessage, getMessage};
