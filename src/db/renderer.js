const { sqQuery, sqInsert, sqUpdate, sqDelete } = require('../database');

// 示例函数：插入数据
async function addTestUser(name, age) {
    try {
        const id = await sqInsert({
            table: 'test',
            data: { name, age },
        });
        console.log(`Inserted user with ID: ${id}`);
    } catch (err) {
        console.error("Insert error:", err);
    }
}

// 示例函数：查询数据
async function getUsers() {
    try {
        const users = await sqQuery({ sql: 'SELECT * FROM test' });
        console.log("Users:", users);
    } catch (err) {
        console.error("Query error:", err);
    }
}

// 示例函数：更新数据
async function updateUser(id, name, age) {
    try {
        const changes = await sqUpdate({
            table: 'test',
            data: { name, age },
            condition: `id = ${id}`,
        });
        console.log(`Updated ${changes} user(s)`);
    } catch (err) {
        console.error("Update error:", err);
    }
}

// 示例函数：删除数据
async function deleteUser(id) {
    try {
        await sqDelete({
            table: 'test',
            condition: `id = ${id}`,
        });
        console.log(`Deleted user with ID: ${id}`);
    } catch (err) {
        console.error("Delete error:", err);
    }
}

// 在适当的时候调用这些函数，例如在按钮点击事件中
