const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer"); //控制台用户交互
const chalk = require("chalk"); //控制台颜色设置

const CreateAction = require("./CreateAction");

module.exports = async function(name, options) {
    const app_name = name;
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir = path.join(cwd, name);
    const createAction = new CreateAction(name, targetAir);
    // 目录是否已经存在？
    if (fs.existsSync(targetAir)) {
        // 是否为强制创建？
        if (options.force) {
            await fs.remove(targetAir);
            createAction.action();
        } else {
            let { action } = await inquirer.prompt([{
                name: "action",
                type: "list",
                message: chalk.green("当前目录已经存在是否覆盖文件"),
                choices: [{
                        name: "强制创建?",
                        value: "overwrite",
                    },
                    {
                        name: "取消",
                        value: false,
                    },
                ],
            }, ]);
            if (!action) {
                return;
            } else if (action === "overwrite") {
                console.log(`\r\n\nRemoving ${app_name}...`);
                await fs.remove(targetAir);
                createAction.action();
            }
        }
    } else {
        createAction.action();
    }
};