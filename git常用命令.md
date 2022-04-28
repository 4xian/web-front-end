# git常用命令

## 1. git提交

```js
 git remote rm origin // 删除origin
    git remote add origin [url] // 在远程地址[url]上添加origin
 
 git pull // 拉取并与本地当前分支合并
 git fetch -p // 拉取远程仓库，不与本地合并

 git add . // 添加至缓存区
    git commit -m '描述'  // 提交到本地
 git push origin dev:dev // 推送  远端名 本地仓库：远端仓库
    
    git log // 查看提交记录ID
    git checkout -b [branch名] // 新建分支，并切换到该分支
```

## 2. git 生成public key

```js
1. git config --global user.name 'xxx' // 设置全局用户名
2. git config --global user.mail 'xxxx@gmail.com' // 设置全局邮箱
3. ssh-keygen -t rsa -C 'xxxx@gmail.com' // 给这个邮箱添加rsa
4. 将生成的pub key 添加到git账户ssh key中
```

## 3. git clone后推到自己新仓库

```js
1. rm -r .git // 删除原有git文件
2. git init // 新建git代码库
3. git add . // 添加指定文件到暂存区
   git commit -m '提交描述' // 提交暂存区到仓库

4. 官网新建一个仓库 无readme.md文件
5. git remote add origin [远程地址] // 关联远程仓库
6. git push --set-upstream origin master // 提交到远程仓库
```

### 4. git 拉取/推送出现文件路径错误/文件名不规范

```js
git config core.protectNTFS false // 关闭git文件校验
```

### 5. git  提交规范

```js
feat: 增加新功能
fix: 修复问题/BUG
style: 代码风格相关无影响运行结果的
perf: 优化/性能提升
refactor: 重构
revert: 撤销修改
test: 测试相关
docs: 文档/注释
chore: 依赖更新/脚手架配置修改等
workflow: 工作流改进
ci: 持续集成
types: 类型定义文件更改
wip: 开发中
```

### 6. git rebase 和 git merge 区别

```js
都用于分支合并，主要在commit记录上不同

git merge：
新增一个merge commit记录，两个分支的旧commit记录指向这个新的commit记录，保留每个分支的commit记录
(git merge xxx : 将当前分支合并到指定分支上)

git rebase：
首先找两个分支的共同commit祖先记录，提取当前分支在祖先记录的所有commit记录，将这些commit记录添加到
另一分支的最新提交后面
(git rebase -i <commit>: 将当前分支移植到指定分支或指定commit上)
(git rebase --continue : 解决冲突之后，继续执行rebase)

```

### 7. git reset 和 git revert 区别

```js
git revert: 撤销某次操作，之前提交的commit记录和history都会保留，并且把这次撤销作为新的提交
(用新的提交来实现撤销，HEAD向前移动)
(git revert <commit_id>: 撤销某个提交)
(git revert HEAD: 撤销前一个版本)
(git revert HEAD^: 撤销前前一个版本)

git rebase: 删除指定的commit，
(git reset: 未指定ID，暂存区会被当前ID版本号覆盖，工作区不变)
(git reset <ID>: 指定ID，暂存区会被指定ID版本号覆盖，工作区不变)
(--mixed: 默认只有暂存区变化)
(--hard: 工作区也会变化)
(--soft: 暂存区和工作区都不会变化)

```

### 8. git stash

```js
保存当前工作进度，后续可以将某次保存的内容推出来

```
