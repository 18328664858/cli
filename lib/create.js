const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer"); //控制台用户交互
const chalk = require("chalk"); //控制台颜色设置
module.exports = async function(name, options) {
    // 执行创建命令
    // 当前命令行选择的目录
    const app_name = name;
    console.log("create=====>", name, options);
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir = path.join(cwd, name);
    console.log(targetAir);
    // 目录是否已经存在？
    if (fs.existsSync(targetAir)) {
        // 是否为强制创建？
        if (options.force) {
            await fs.remove(targetAir);
        } else {
            // 询问用户是否确定要覆盖
            let { action } = await inquirer.prompt([{
                name: "action",
                type: "list",
                message: chalk.green("当前用户创建询问是否强制覆盖文件:"),
                choices: [{
                        name: "强制创建?",
                        value: "overwrite",
                    },
                    {
                        name: "Cancel",
                        value: false,
                    },
                ],
            }, ]);
            if (!action) {
                return;
            } else if (action === "overwrite") {
                // 移除已存在的目录
                console.log(`\r\n\nRemoving ${app_name}...`);
                await fs.remove(targetAir);
            }
        }
    }
};