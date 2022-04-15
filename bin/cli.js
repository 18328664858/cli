#! /usr/bin/env node

const program = require("commander"); //commander 自定义命令行指令
const chalk = require("chalk"); //控制台颜色设置
const figlet = require("figlet"); //logo

console.log("defs working");
program
// 定义命令和参数
    .command("cre <app-name>")
    .description("create a new project")
    .option("-f, --force", "overwrite target directory if it exist") // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
    .action((name, options) => {
        require("../lib/create")(name, options);
    });

program
// 配置版本号信息
    .version(`v${require("../package.json").version}`)
    .usage("<command> [option]");

program.on("--help", () => {
            console.log(
                "\r\n" +
                figlet.textSync("CLI-DEF", {
                    font: "Ghost",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 80,
                    whitespaceBreak: true,
                })
            );
            console.log(`\r\nRun ${chalk.red(`cli <command> --help`)} for detailed usage of given command\r\n`);
});

// program
//   .command("ui")
//   .description("start add open roc-cli ui")
//   .option("-p, --port <port>", "Port used for the UI Server")
//   .action(option => {
//     console.log(option);
//   });

// 解析用户执行命令传入参数
program.parse(process.argv);