module.exports = {
  types: [
    {
      value: "chore",
      name: "🎨  chore:        除定义类型之外的代码修改",
    },
    {
      value: "feat",
      name: "✨  feat(CR):     新增功能或特性",
    },
    {
      value: "fix",
      name: "🐛  fix(CR):      修复 Bug 缺陷",
    },
    {
      value: "perf",
      name: "⚡️  perf(CR):     提高代码性能的变更",
    },
    {
      value: "refactor",
      name: "🔨  refactor(CR): 功能逻辑较大的重构",
    },
    {
      value: "revert",
      name: "🗑   revert(CR):   代码回退操作",
    },
    {
      value: "docs",
      name: "📝  docs:         文档类的更新",
    },
    {
      value: "ci",
      name: "👷  ci:           持续集成类调整",
    },
    {
      value: "wip",
      name: "🚧  wip:          半成品",
    },
    {
      value: "workflow",
      name: "⚙️   workflow:     工作流调整",
    },
    {
      value: "deps",
      name: "⬆️   deps:         依赖更改",
    },
    {
      value: "test",
      name: "✅  test:         新增测试用例或是更新现有测试用例",
    },
    {
      value: "build",
      name: "🚀  build:        编译构建类的代码调整",
    },
    {
      value: "style",
      name: "💄  style:        代码格式化",
    },
  ],
  scopes: [],
  messages: {
    type: "请选择提交类型：",
    scope: "请选择一个影响范围 (可选):",
    customScope: "请输入本次修改影响范围（可选）：",
    subject: "请简述本次提交行为（必填，动词前置）：",
    body: "请输入详细描述（可选）：",
    breaking: "非兼容性说明 (可选):\n",
    footer: "关联关闭的issue，例如：#31, #34(可选):\n",
    confirmCommit: "确认按照规范填写了以上内容？（y/n）",
  },
  allowCustomScopes: true,
  skipQuestions: ["body", "footer"],
  allowBreakingChanges: ["feat", "refactor"],
  subjectLimit: 256,
};
