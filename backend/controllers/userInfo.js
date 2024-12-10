const sql = require("mssql/msnodesqlv8");
const getPool = require("../database/lazyConn");

const addUser = async (user) => {
    let pool;
    try {
        const { nanoid } = await import("nanoid");
        const id = nanoid();

        pool = await getPool();

        const isMatched = await getUser(user.email);
        if (isMatched.exists==true) {
            console.log("User Already Exists");
            return { error: true, message: "User already exists" };
        }

        await pool.request()
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

        await pool.request()
            .input("lastSeen", sql.VarChar, lastSeen)
            .input("email", sql.VarChar, email)
            .query(`
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

const setSocketId = async(email,socket_id)=>{
    let pool;
    try{

        pool = await getPool();
        const result = await pool.request()
        .input("email",sql.VarChar,email)
        .input("SOCKET_ID",sql.VarChar,socket_id)
        .query(`UPDATE USERS
            SET SOCKET_ID=@SOCKET_ID
            WHERE EMAIL = @email `);

        console.log("User updated successfully");

    }catch(err){
        console.error("Error updating socket_id:", err);
        throw new Error("Database query failed");
    }/* finally{
        if(pool){
            await pool.close();
        }
    } */
}


const getUser = async (email) => {
    let pool;
    try {
        pool = await getPool();
        console.log("Database pool initialized successfully");

        const result = await pool.request()
            .input("email", sql.VarChar, email)
            .query(`
                SELECT ID, F_NAME, L_NAME, EMAIL, PASSWORD,SOCKET_ID
                FROM USERS
                WHERE EMAIL = @email
            `);

        if (result.recordset.length === 0) {
            return { exists: false };
        }
        await userState(email,"online");
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

const getAllUsers = async (email)=>{
    let pool;
    try {
        pool = await getPool();

        const result = await pool.request()
        .input("email",sql.VarChar,email)
        .query(`
            SELECT ID, F_NAME, L_NAME, EMAIL,[DESC] FROM USERS
            WHERE EMAIL != @email
        `);

        if (result.recordset.length === 0) {
            return { info:[] };
        }
        return {info: result.recordset };

    } catch (err) {
        console.error("Error fetching user:", err);
        throw new Error("Database query failed");
    } /* finally {
        if (pool) await pool.close();
    } */
}

module.exports = {addUser, getUser, getAllUsers,setSocketId};
