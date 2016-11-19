# Base64 解码扩展

## 功能

* 支持 Firefox 49+ 和 chrome
* 支持多种不同的字符编码
* 一键复制解码后的文本

## 安装

Firefox 直接通过 [AMO](https://addons.mozilla.org/en-US/firefox/addon/select2decode/) 安装，或者下载 `artifacts/` 目录下的 xpi 文件手动安装。

Chrome 通过下载 `artifacts/` 目录下的 `select2decode.crx` 手动安装。


## 使用方式

通过选中 Base64 编码的文本，然后单击右键，在弹出的右键菜单中选择 `Decode Base64 Text`。


## 已知问题

* 暂不支持 input 和 textarea 里的文本


## 开发

首先 clone 到本地，然后使用 `npm install` 安装依赖，之后运行 `npm run dist` 命令。
该命令会在项目中生成一个 `dist` 的目录，这时，就可以在 chrome 或 firefox 中将该目录添加为扩展的目录了。
