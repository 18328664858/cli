const inquirer = require("inquirer"); //控制台用户交互
const chalk = require("chalk"); //控制台颜色设置
const ora = require("ora"); //控制台加载动画
const util = require("util");
const path = require("path");
const downloadGitRepo = require("download-git-repo");
const { getTagList, getRepoList } = require("./http");
let spinner;
// 添加加载动画
async function loading(fn, message, ...args) {
    if (!fn || typeof fn !== "function") return;
    spinner = ora(message).start();
    spinner.color = "green";
    try {
        const result = await fn(...args);
        spinner.succeed("success");
        return result;
    } catch (error) {
        spinner.fail("方法调用出错");
    }
}

class CreateAction {
    constructor(name, dir) {
        this.name = name;
        this.dir = dir;
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    async downloadRepo(repo, tag) {
        const sourceUrl = `huwei-as/${repo}${tag ? "#" + tag : ""}`;
        const result = await loading(
            this.downloadGitRepo, // 远程下载方法
            "正在下载模板....", // 加载提示信息
            sourceUrl,
            path.resolve(process.cwd(), this.dir)
        );
    }

    async getRepo() {
        // 1、获取github上的所有模板信息
        const repoList = await loading(getRepoList, "获取模板中...");
        if (!repoList) return;
        const repoArr = repoList.map(item => item.name);
        // 2、 获取用户选择的模板信息
        const { repo } = await inquirer.prompt({
            name: "repo",
            type: "list",
            choices: repoArr,
            message: chalk.green("请选择你要创建的模板"),
        });
        return repo;
    }

    async getTag(repo) {
        // 3、 获取github上的所有模板对应的tag
        const tagList = await loading(getTagList, "获取版本信息中...", repo);
        if (!tagList) return;
        const tagArr = tagList.map(item => item.name);
        // 4、 获取用户选择的tag
        const { tag } = await inquirer.prompt({
            name: "tag",
            type: "list",
            choices: tagArr,
            message: chalk.green("请选择你要创建的版本"),
        });
        return tag;
    }

    async action() {
        const repo = await this.getRepo();
        if (repo) {
            const tag = await this.getTag(repo);
            console.log(`  选择的版本:${chalk.cyan(repo)},选择的版本号:${chalk.cyan(tag)}`);
            await this.downloadRepo(repo, tag);
        }
    }
}

module.exports = CreateAction;