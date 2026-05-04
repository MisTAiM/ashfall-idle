// ================================================================
// ASHFALL IDLE — engine-combat.js
// Combat extensions patched onto the GameEngine prototype.
// New combat mechanics, ability effects, passive systems.
// Loaded AFTER engine.js.
// ================================================================

(function patchCombatEngine() {
  const proto = GameEngine.prototype;

  // ── ABILITY USE ───────────────────────────────────────────────
  proto.useAbility = function(abilityId) {
    const c = this.state.combat;
    if (!c.active) { this.emit('notification',{type:'warn',text:'Must be in combat to use abilities.'}); return; }
    const ab = GAME_DATA.abilities.find(a => a.id === abilityId);
    if (!ab) return;
    if ((this.state.skills.tactics?.level || 0) < ab.tacticsReq) {
      this.emit('notification',{type:'warn',text:`Requires Tactics level ${ab.tacticsReq}.`}); return;
    }
    if (!this.state.equippedAbilities.includes(abilityId)) {
      this.emit('notification',{type:'warn',text:'Ability not equipped.'}); return;
    }
    const cd = c.abilityCooldowns[abilityId] || 0;
    if (cd > 0) {
      this.emit('notification',{type:'warn',text:`${ab.name} on cooldown (${Math.ceil(cd)}s).`}); return;
    }
    // Execute effect
    const monster = GAME_DATA.monsters[c.monster] || (GAME_DATA.worldBosses||[]).find(b=>b.id===c.monster);
    const fx = ab.effect;
    if (fx.type === 'buff') {
      c.activeBuffs.push({ stat:fx.stat, value:fx.value, remaining:fx.hits||1, type:'hits' });
      this.emit('notification',{type:'success',text:`${ab.name}: Next hit deals ×${fx.value} damage!`});
    } else if (fx.type === 'defence_buff') {
      c.activeBuffs.push({ stat:'damageReduction', value:fx.reducePct, remaining:fx.duration, _maxDuration:fx.duration, type:'time' });
      this.emit('notification',{type:'success',text:`${ab.name}: -${fx.reducePct}% damage for ${fx.duration}s!`});
    } else if (fx.type === 'combat_buff') {
      if (fx.dmgBonus) c.activeBuffs.push({ stat:'damageMult', value:1+fx.dmgBonus/100, remaining:fx.duration, _maxDuration:fx.duration, type:'time' });
      if (fx.speedBonus) c.activeBuffs.push({ stat:'speedBonus', value:fx.speedBonus, remaining:fx.duration, _maxDuration:fx.duration, type:'time' });
      this.emit('notification',{type:'success',text:`${ab.name}: +${fx.dmgBonus||0}% damage${fx.speedBonus?', +'+fx.speedBonus+'% speed':''} for ${fx.duration}s!`});
    } else if (fx.type === 'dodge_buff') {
      c.activeBuffs.push({ stat:'dodgeCharges', value:fx.dodges, remaining:fx.duration, _maxDuration:fx.duration, type:'time', _dodges:fx.dodges });
      this.emit('notification',{type:'success',text:`${ab.name}: Next ${fx.dodges} attacks dodged!`});
    } else if (fx.type === 'spell_burst' && monster) {
      const mB = this.getStatTotal('magicBonus');
      const mL = this.state.skills.magic?.level || 1;
      let dmg = Math.floor((mL * 0.5 + mB * 0.3) * fx.mult);
      c.monsterHp -= dmg;
      this.emit('combatHit',{who:'player',dmg,crit:true});
    } else if (fx.type === 'nuke' && monster) {
      const mB = this.getStatTotal('magicBonus');
      const mL = this.state.skills.magic?.level || 1;
      let dmg = Math.floor((mL * 0.5 + mB * 0.3) * fx.mult);
      c.monsterHp -= dmg;
      if (fx.burnStacks) this.applyStatus('monster','burn',fx.burnStacks,15);
      this.emit('combatHit',{who:'player',dmg,crit:true});
      this.emit('notification',{type:'achievement',text:`${ab.name}: ${dmg} damage!`});
    }
    c.abilityCooldowns[abilityId] = ab.cooldown;
    this.addXp('tactics', Math.max(1, Math.floor(ab.tacticsReq * 0.5)));
    this.emit('abilityUsed', { ability:ab });
  };

  // ── DHAROK'S PASSIVE ──────────────────────────────────────────
  // Hook into playerAttack via prototype patch
  const _origPlayerAttack = proto.playerAttack;
  proto.playerAttack = function(monster) {
    const weapon = this.getEquippedItem('weapon');
    if (weapon?.passiveEffect?.type === 'dharok') {
      // Scale max hit based on missing HP
      const maxHp = this.getMaxHp();
      const curHp = this.state.combat.playerHp || maxHp;
      const missingPct = (maxHp - curHp) / maxHp; // 0-1
      // At 0 HP missing: normal. At full HP missing: triple.
      const dharokMult = 1 + missingPct * 2;
      this.state.combat.activeBuffs.push({ stat:'damageMult', value:dharokMult, remaining:1, type:'hits', _dharok:true });
      // Remove after use (hits:1)
    }
    return _origPlayerAttack.call(this, monster);
  };

  // ── SANFEW SERUM EFFECT ───────────────────────────────────────
  proto.drinkSanfewSerum = function() {
    const s = this.state;
    s.combat.statusEffects.player = {}; // clear all
    s.prayerPoints = Math.min(s.prayerPoints + 30, 99);
    this.emit('notification',{type:'success',text:'Status effects cleared. +30 prayer points.'});
    this.removeItem('sanfew_serum', 1);
  };

  // ── MULTI-HIT SPEC (Scythe) ──────────────────────────────────
  proto._specTripleHit = function(monster, mult) {
    const c = this.state.combat;
    const sL = this.state.skills.strength?.level || 1;
    const sB = this.getStatTotal('strengthBonus');
    const maxHit = Math.floor((1 + sL/10) * (1 + sB/80) * 4 * mult);
    let totalDmg = 0;
    for (let i = 0; i < 3; i++) {
      const dmg = this.randInt(Math.floor(maxHit * 0.1), maxHit);
      c.monsterHp -= dmg;
      totalDmg += dmg;
      this.emit('combatHit', { who:'player', dmg, crit: i === 0 });
    }
    this.emit('notification', { type:'info', text:`Scythe: 3 hits for ${totalDmg} total damage!` });
  };

  // ── POTION ACTIVE EFFECTS ─────────────────────────────────────
  proto.drinkPotion = function(itemId) {
    const item = GAME_DATA.items[itemId];
    if (!item || item.type !== 'potion') return;
    if (!(this.state.bank[itemId] > 0)) { this.emit('notification',{type:'warn',text:'No potions left.'}); return; }

    if (item.prayerRestore) {
      this.state.prayerPoints = Math.min(99, this.state.prayerPoints + item.prayerRestore);
      this.emit('notification', { type:'success', text:`+${item.prayerRestore} prayer points.` });
    }
    if (item.boost) {
      const duration = itemId === 'overload_potion' ? 300 : 180; // 5 min or 3 min
      for (const [skill, amount] of Object.entries(item.boost)) {
        this.state.combat.activeBuffs.push({
          stat: skill + 'Bonus', value: amount, remaining: duration, type:'time'
        });
      }
      const boostStr = Object.entries(item.boost).map(([s,v]) => `+${v} ${s}`).join(', ');
      this.emit('notification', { type:'success', text:`${item.name}: ${boostStr} for ${Math.floor(duration/60)}min.` });
    }
    if (item.clearNegative) this.drinkSanfewSerum();
    this.removeItem(itemId, 1);
  };

  console.log('[Ashfall] engine-combat.js loaded — ability system, Dharok passive, potion effects patched.');
})();
