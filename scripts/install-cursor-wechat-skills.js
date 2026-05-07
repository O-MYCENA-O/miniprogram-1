#!/usr/bin/env node

/**
 * 将 player4sir/wechat-mini-program-skill 的技能安装到 Cursor 标准目录：
 *   <项目根>/.cursor/skills/<skill-name>/SKILL.md
 *
 * 用法（在项目根目录执行）:
 *   node scripts/install-cursor-wechat-skills.js
 */

const fs = require('fs');
const path = require('path');
const { SKILLS } = require('./install-wechat-skills-upstream.js');

function buildCursorDescription(skillData) {
  const triggers = (skillData.triggers || []).join(', ');
  const base = skillData.description || '';
  return `${base} Use when the user mentions or works on: ${triggers}.`;
}

function yamlScalarDoubleQuoted(str) {
  return `"${String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function installCursorWechatSkills() {
  const baseDir = path.join(process.cwd(), '.cursor', 'skills');

  console.log('Cursor WeChat Mini Program Skills Installer');
  console.log(`Target: ${baseDir}\n`);

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  let installedCount = 0;

  Object.entries(SKILLS).forEach(([skillName, skillData]) => {
    const skillDir = path.join(baseDir, skillName);
    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }

    const skillMdPath = path.join(skillDir, 'SKILL.md');
    const description = buildCursorDescription(skillData).slice(0, 1024);
    const frontmatter = `---
name: ${skillName}
description: ${yamlScalarDoubleQuoted(description)}
---

`;
    fs.writeFileSync(skillMdPath, frontmatter + skillData.content, 'utf8');
    installedCount++;
    console.log(`OK  ${skillName}`);
  });

  const readmePath = path.join(baseDir, 'README.md');
  const readmeContent = `# WeChat Mini Program Cursor Skills

从 [wechat-mini-program-skill](https://github.com/player4sir/wechat-mini-program-skill) 生成，共 ${installedCount} 个技能。

在项目根执行 \`node scripts/install-cursor-wechat-skills.js\` 可重新安装/覆盖 SKILL.md。

## 技能列表

${Object.entries(SKILLS)
  .map(([name, data]) => `- **${name}**: ${data.description}`)
  .join('\n')}
`;
  fs.writeFileSync(readmePath, readmeContent, 'utf8');

  console.log(`\n完成：已写入 ${installedCount} 个 SKILL.md 与 README.md`);
}

if (require.main === module) {
  try {
    installCursorWechatSkills();
  } catch (err) {
    console.error('安装失败:', err.message);
    process.exit(1);
  }
}

module.exports = { installCursorWechatSkills, buildCursorDescription };
