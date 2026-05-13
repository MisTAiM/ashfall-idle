# Ashfall Idle

Dark fantasy idle RPG. Train 28 skills, fight 59 monsters, conquer 14 dungeons, forge legendary weapons.

**Play:** [ashfall-idle.vercel.app](https://ashfall-idle.vercel.app)

---

## Structure

```
js/
  core/       engine.js · state.js · save.js
  data/       index.js · items.js · combat.js · npcs.js · quests.js
  systems/    combat.js · quests.js · skills.js · dungeons.js · endgame.js · social.js
  ui/         core.js · skills.js · quests.js · endgame.js · magic.js · character.js · upgrades.js
  art/        sprites.js · music.js
  services/   firebase.js · debug.js · online.js · admin.js
  content/    segment-content.js · [future content drops]
  modes/      [ironman · hardcore · seasonal · group — stubs]
```

## Stack

Vanilla JS · Firebase · Vercel
