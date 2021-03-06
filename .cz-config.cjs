module.exports = {
  types: [
    {
      value: "chore",
      name: "ð¨  chore:        é¤å®ä¹ç±»åä¹å¤çä»£ç ä¿®æ¹",
    },
    {
      value: "feat",
      name: "â¨  feat(CR):     æ°å¢åè½æç¹æ§",
    },
    {
      value: "fix",
      name: "ð  fix(CR):      ä¿®å¤ Bug ç¼ºé·",
    },
    {
      value: "perf",
      name: "â¡ï¸  perf(CR):     æé«ä»£ç æ§è½çåæ´",
    },
    {
      value: "refactor",
      name: "ð¨  refactor(CR): åè½é»è¾è¾å¤§çéæ",
    },
    {
      value: "revert",
      name: "ð   revert(CR):   ä»£ç åéæä½",
    },
    {
      value: "docs",
      name: "ð  docs:         ææ¡£ç±»çæ´æ°",
    },
    {
      value: "ci",
      name: "ð·  ci:           æç»­éæç±»è°æ´",
    },
    {
      value: "wip",
      name: "ð§  wip:          åæå",
    },
    {
      value: "workflow",
      name: "âï¸   workflow:     å·¥ä½æµè°æ´",
    },
    {
      value: "deps",
      name: "â¬ï¸   deps:         ä¾èµæ´æ¹",
    },
    {
      value: "test",
      name: "â  test:         æ°å¢æµè¯ç¨ä¾ææ¯æ´æ°ç°ææµè¯ç¨ä¾",
    },
    {
      value: "build",
      name: "ð  build:        ç¼è¯æå»ºç±»çä»£ç è°æ´",
    },
    {
      value: "style",
      name: "ð  style:        ä»£ç æ ¼å¼å",
    },
  ],
  scopes: [],
  messages: {
    type: "è¯·éæ©æäº¤ç±»åï¼",
    scope: "è¯·éæ©ä¸ä¸ªå½±åèå´ (å¯é):",
    customScope: "è¯·è¾å¥æ¬æ¬¡ä¿®æ¹å½±åèå´ï¼å¯éï¼ï¼",
    subject: "è¯·ç®è¿°æ¬æ¬¡æäº¤è¡ä¸ºï¼å¿å¡«ï¼å¨è¯åç½®ï¼ï¼",
    body: "è¯·è¾å¥è¯¦ç»æè¿°ï¼å¯éï¼ï¼",
    breaking: "éå¼å®¹æ§è¯´æ (å¯é):\n",
    footer: "å³èå³é­çissueï¼ä¾å¦ï¼#31, #34(å¯é):\n",
    confirmCommit: "ç¡®è®¤æç§è§èå¡«åäºä»¥ä¸åå®¹ï¼ï¼y/nï¼",
  },
  allowCustomScopes: true,
  skipQuestions: ["body", "footer"],
  allowBreakingChanges: ["feat", "refactor"],
  subjectLimit: 256,
};
