// ================================================================
// ASHFALL IDLE — systems/combat.js
// Full combat engine: melee, ranged, magic, Dharok, specs,
// abilities, mana, spell damage, buffs, stun.
// Merges: engine-combat.js + spell-damage-handler.js 
//         + magic-system-unified.js + skills-integration.js
// ================================================================
// ================================================================
// ASHFALL IDLE — engine-combat.js
// Combat extensions patched onto the GameEngine prototype.
// Loaded AFTER engine.js — patches override engine.js versions.
// ================================================================

(function patchCombatEngine() {
  const proto = GameEngine.prototype;

  // ── REWRITE useAbility — accepts string ID from UI ──────────────
  // engine.js useAbility(slotIdx) is replaced with this version
  // which accepts either a string ID (from UI onclick) or slot index.
  proto.useAbility = function(input) {
    const c = this.state.combat;
    if (!c.active) { this.emit('notification',{type:'warn',text:'Must be in combat to use abilities.'}); return; }

    // Resolve ability — accept string ID or slot index
    let ab, id;
    if (typeof input === 'string') {
      ab = GAME_DATA.abilities.find(a => a.id === input);
      id = input;
    } else {
      id = this.state.equippedAbilities[input];
      ab = id ? GAME_DATA.abilities.find(a => a.id === id) : null;
    }
    if (!ab) return;

    const tacticsLv = this.state.skills.tactics?.level || 0;
    if (tacticsLv < (ab.tacticsReq || 0)) {
      this.emit('notification',{type:'warn',text:`Requires Tactics level ${ab.tacticsReq}.`}); return;
    }
    if ((c.abilityCooldowns[id] || 0) > 0) {
      this.emit('notification',{type:'warn',text:`${ab.name} on cooldown (${Math.ceil(c.abilityCooldowns[id])}s).`}); return;
    }

    const monster = GAME_DATA.monsters[c.monster] || (GAME_DATA.worldBosses||[]).find(b=>b.id===c.monster);
    const fx = ab.effect;

    // ── EXECUTE EFFECT BY TYPE ────────────────────────────────────
    if (fx.type === 'buff') {
      // Power Strike — next hit multiplied
      const dur = fx.hits ? 999 : (fx.duration || 10);
      c.activeBuffs.push({ stat:fx.stat||'damageMult', value:fx.value, remaining:fx.hits||1, _maxDuration:fx.hits||1, type:'hits', _hitsLeft:fx.hits||1 });
      this.emit('notification',{type:'success',text:`${ab.name}: Next hit ×${fx.value}!`});
      this.emit('abilityUsed',{ability:ab, source:'buff'});

    } else if (fx.type === 'multi') {
      // Rapid Shot — fire multiple ranged shots
      if (!monster) return;
      const rL = this.state.skills.ranged?.level || 1;
      const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
      const shotMax = Math.max(1, Math.floor((1 + rL/10) * (1 + rB/80) * 4 * (fx.mult||0.8)));
      for (let i = 0; i < (fx.shots||3); i++) {
        const dmg = this.randInt(Math.floor(shotMax*0.15), shotMax);
        c.monsterHp -= dmg;
        this.emit('combatHit',{who:'player',dmg,crit:i===0,source:'ability'});
        this.consumeAmmo();
      }
      this.emit('notification',{type:'success',text:`${ab.name}: ${fx.shots||3} shots fired!`});
      this.emit('abilityUsed',{ability:ab, source:'damage'});

    } else if (fx.type === 'spell_burst') {
      // Arcane Burst — magic damage ignoring defence
      if (!monster) return;
      const mB = this.getStatTotal('magicBonus');
      const mL = this.state.skills.magic?.level || 1;
      const maxHit = Math.max(1, Math.floor((mL * 0.5 + mB * 0.4) * (fx.mult||2.0)));
      const dmg = this.randInt(Math.floor(maxHit*0.5), maxHit);
      c.monsterHp -= dmg;
      this.emit('combatHit',{who:'player',dmg,crit:true,source:'ability'});
      this.emit('notification',{type:'success',text:`${ab.name}: ${dmg} arcane damage!`});
      this.emit('abilityUsed',{ability:ab, source:'damage'});

    } else if (fx.type === 'defence_buff') {
      // Shield Wall — reduce incoming damage
      c.activeBuffs.push({ stat:'damageReduction', value:fx.reducePct||60, remaining:fx.duration||10, _maxDuration:fx.duration||10, type:'time' });
      this.emit('notification',{type:'success',text:`${ab.name}: -${fx.reducePct||60}% damage for ${fx.duration||10}s!`});
      this.emit('abilityUsed',{ability:ab, source:'defence'});

    } else if (fx.type === 'combat_buff') {
      // Battle Cry — damage + speed boost
      if (fx.dmgBonus) c.activeBuffs.push({ stat:'damageMult', value:1+fx.dmgBonus/100, remaining:fx.duration||15, _maxDuration:fx.duration||15, type:'time' });
      if (fx.speedBonus) c.activeBuffs.push({ stat:'speedBonus', value:fx.speedBonus, remaining:fx.duration||15, _maxDuration:fx.duration||15, type:'time' });
      this.emit('notification',{type:'success',text:`${ab.name}: +${fx.dmgBonus||0}% dmg${fx.speedBonus?`, +${fx.speedBonus}% speed`:''}  for ${fx.duration||15}s!`});
      this.emit('abilityUsed',{ability:ab, source:'buff'});

    } else if (fx.type === 'dodge_buff') {
      // Void Step — dodge next N attacks
      c.activeBuffs.push({ stat:'dodgeCharges', value:fx.dodges||3, remaining:fx.duration||20, _maxDuration:fx.duration||20, type:'time', _dodges:fx.dodges||3 });
      this.emit('notification',{type:'success',text:`${ab.name}: Next ${fx.dodges||3} attacks will be dodged!`});
      this.emit('abilityUsed',{ability:ab, source:'defence'});

    } else if (fx.type === 'on_kill_heal') {
      // Blood Frenzy — heal on kill buff
      c.activeBuffs.push({ stat:'onKillHeal', value:fx.healPct||15, remaining:fx.duration||20, _maxDuration:fx.duration||20, type:'time' });
      this.emit('notification',{type:'success',text:`${ab.name}: Heal ${fx.healPct||15}% on kill for ${fx.duration||20}s!`});
      this.emit('abilityUsed',{ability:ab, source:'buff'});

    } else if (fx.type === 'nuke') {
      // Ash Nova — massive magic + burn
      if (!monster) return;
      const mB = this.getStatTotal('magicBonus');
      const mL = this.state.skills.magic?.level || 1;
      const maxHit = Math.max(1, Math.floor((mL * 0.6 + mB * 0.5) * (fx.mult||3.0)));
      const dmg = this.randInt(Math.floor(maxHit*0.4), maxHit);
      c.monsterHp -= dmg;
      if (fx.burnStacks) this.applyStatus('monster','burn',fx.burnStacks,20);
      this.emit('combatHit',{who:'player',dmg,crit:true,source:'ability'});
      this.emit('notification',{type:'achievement',text:`${ab.name}: ${dmg} damage${fx.burnStacks?` + ${fx.burnStacks} burn stacks`:''}!`});
      this.emit('abilityUsed',{ability:ab, source:'damage'});

    } else if (fx.type === 'debuff') {
      // Status-only abilities — Ice Blast, Venom Strike
      if (fx.freeze)  this.applyStatus('monster','freeze', fx.freeze,  8);
      if (fx.poison)  this.applyStatus('monster','poison', fx.poison, 12);
      if (fx.burn)    this.applyStatus('monster','burn',   fx.burn,   10);
      const statusName = fx.freeze ? 'Freeze' : fx.poison ? 'Poison' : 'Burn';
      const stacks = fx.freeze || fx.poison || fx.burn || 0;
      this.emit('notification',{type:'success',text:`${ab.name}: Applied ${stacks} ${statusName} stacks!`});
      this.emit('abilityUsed',{ability:ab, source:'debuff'});

    } else if (fx.type === 'execute') {
      // Execute — massive damage if target below HP threshold
      if (!monster) return;
      const m = monster;
      const hpThreshold = fx.threshold || 0.30;
      if (c.monsterHp <= m.hp * hpThreshold) {
        const sL = this.state.skills.strength?.level || 1;
        const sB = this.getStatTotal('strengthBonus');
        const maxHit = Math.max(1, Math.floor((1+sL/10)*(1+sB/80)*4*(fx.mult||3)));
        const dmg = this.randInt(Math.floor(maxHit*0.5), maxHit);
        c.monsterHp -= dmg;
        this.emit('combatHit',{who:'player',dmg,crit:true,source:'ability'});
        this.emit('notification',{type:'achievement',text:`${ab.name}: EXECUTED for ${dmg} damage!`});
        this.emit('abilityUsed',{ability:ab, source:'damage'});
      } else {
        this.emit('notification',{type:'warn',text:`Target above ${Math.round(hpThreshold*100)}% HP — cannot execute.`});
        c.abilityCooldowns[id] = 0; // refund cooldown on fail
        return;
      }

    } else if (fx.type === 'heal') {
      // Heal — restore % of max HP
      const maxHp = this.getMaxHp();
      const healed = Math.floor(maxHp * (fx.pct || 0.30));
      c.playerHp = Math.min(maxHp, c.playerHp + healed);
      this.emit('notification',{type:'success',text:`${ab.name}: Restored ${healed} HP!`});
      this.emit('abilityUsed',{ability:ab, source:'heal'});

    } else if (fx.type === 'lifesteal_spell') {
      // Soul Drain — magic damage + heal for portion dealt
      if (!monster) return;
      const mB = this.getStatTotal('magicBonus');
      const mL = this.state.skills.magic?.level || 1;
      const maxHit = Math.max(1, Math.floor((mL * 0.5 + mB * 0.4) * (fx.mult||1.2)));
      const dmg = this.randInt(Math.floor(maxHit*0.4), maxHit);
      c.monsterHp -= dmg;
      const healed = Math.floor(dmg * (fx.stealPct||50) / 100);
      c.playerHp = Math.min(this.getMaxHp(), c.playerHp + healed);
      this.emit('combatHit',{who:'player',dmg,crit:false,source:'ability'});
      this.emit('notification',{type:'success',text:`${ab.name}: ${dmg} damage, drained ${healed} HP!`});
      this.emit('abilityUsed',{ability:ab, source:'damage'});

    } else if (fx.type === 'dodge_strike') {
      // Shadow Step — deal damage + grant dodge charges
      if (!monster) return;
      const sL = this.state.skills.strength?.level || 1;
      const baseDmg = (fx.baseDmg||50) + Math.floor(sL * 0.5);
      const dmg = this.randInt(Math.floor(baseDmg*0.5), baseDmg);
      c.monsterHp -= dmg;
      c.activeBuffs.push({ stat:'dodgeCharges', value:fx.dodges||1, remaining:fx.duration||5, _maxDuration:fx.duration||5, type:'time', _dodges:fx.dodges||1 });
      this.emit('combatHit',{who:'player',dmg,crit:false,source:'ability'});
      this.emit('notification',{type:'success',text:`${ab.name}: ${dmg} damage + dodge ${fx.dodges||1} attack(s)!`});
      this.emit('abilityUsed',{ability:ab, source:'damage'});

    } else if (fx.type === 'cleave') {
      // Cleave — multi-hit melee swings
      if (!monster) return;
      const sL = this.state.skills.strength?.level || 1;
      const sB = this.getStatTotal('strengthBonus');
      const baseMax = Math.max(1, Math.floor((1 + sL/10) * (1 + sB/80) * 4 * (fx.mult||0.7)));
      let totalDmg = 0;
      for (let i = 0; i < (fx.hits||3); i++) {
        const dmg = this.randInt(Math.floor(baseMax*0.2), baseMax);
        c.monsterHp -= dmg;
        totalDmg += dmg;
        this.emit('combatHit',{who:'player',dmg,crit:false,source:'ability'});
      }
      this.emit('notification',{type:'success',text:`${ab.name}: ${fx.hits||3} swings for ${totalDmg} total damage!`});
      this.emit('abilityUsed',{ability:ab, source:'damage'});

    } else if (fx.type === 'blood_sacrifice') {
      // Blood Pact — sacrifice HP for massive damage
      if (!monster) return;
      const maxHp = this.getMaxHp();
      const hpCost = Math.floor(maxHp * (fx.hpCost||0.20));
      if (c.playerHp <= hpCost) { this.emit('notification',{type:'warn',text:`Not enough HP to use ${ab.name}!`}); c.abilityCooldowns[id] = 0; return; }
      c.playerHp -= hpCost;
      const sL = this.state.skills.strength?.level || 1;
      const sB = this.getStatTotal('strengthBonus');
      const maxHit = Math.max(1, Math.floor((1 + sL/10) * (1 + sB/80) * 4 * (fx.mult||4)));
      const dmg = this.randInt(Math.floor(maxHit*0.5), maxHit);
      c.monsterHp -= dmg;
      this.emit('combatHit',{who:'player',dmg,crit:true,source:'ability'});
      this.emit('notification',{type:'achievement',text:`${ab.name}: Sacrificed ${hpCost} HP for ${dmg} damage!`});
      this.emit('abilityUsed',{ability:ab, source:'damage'});

    } else if (fx.type === 'mark_of_death') {
      // Mark of Death — buff all damage for duration
      c.activeBuffs.push({ stat:'damageMult', value:1+(fx.dmgBonus||30)/100, remaining:fx.duration||20, _maxDuration:fx.duration||20, type:'time' });
      this.emit('notification',{type:'success',text:`${ab.name}: +${fx.dmgBonus||30}% damage for ${fx.duration||20}s!`});
      this.emit('abilityUsed',{ability:ab, source:'buff'});

    } else if (fx.type === 'expose') {
      // Expose Weakness — attack bonus buff
      c.activeBuffs.push({ stat:'attackBonus', value:fx.bonus||30, remaining:fx.duration||30, _maxDuration:fx.duration||30, type:'time' });
      this.emit('notification',{type:'success',text:`${ab.name}: +${fx.bonus||30} Attack for ${fx.duration||30}s!`});
      this.emit('abilityUsed',{ability:ab, source:'buff'});

    } else if (fx.type === 'barrage') {
      // Barrage — many ranged hits
      if (!monster) return;
      const rL = this.state.skills.ranged?.level || 1;
      const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
      const baseMax = Math.max(1, Math.floor((1 + rL/10) * (1 + rB/80) * 4 * (fx.mult||0.65)));
      let totalDmg = 0;
      for (let i = 0; i < (fx.hits||5); i++) {
        const dmg = this.randInt(Math.floor(baseMax*0.15), baseMax);
        c.monsterHp -= dmg;
        totalDmg += dmg;
        this.consumeAmmo();
      }
      this.emit('combatHit',{who:'player',dmg:totalDmg,crit:false,source:'ability'});
      this.emit('notification',{type:'success',text:`${ab.name}: ${fx.hits||5} arrows for ${totalDmg} total damage!`});
      this.emit('abilityUsed',{ability:ab, source:'damage'});

    } else if (fx.type === 'void_rupture') {
      // Void Rupture — high magic damage, partially ignores evasion
      if (!monster) return;
      const mB = this.getStatTotal('magicBonus');
      const mL = this.state.skills.magic?.level || 1;
      const maxHit = Math.max(1, Math.floor((mL * 0.7 + mB * 0.6) * (fx.mult||2.0)));
      const dmg = this.randInt(Math.floor(maxHit*0.5), maxHit);
      c.monsterHp -= dmg;
      this.emit('combatHit',{who:'player',dmg,crit:true,source:'ability'});
      this.emit('notification',{type:'achievement',text:`${ab.name}: ${dmg} void damage!`});
      this.emit('abilityUsed',{ability:ab, source:'damage'});

    } else if (fx.type === 'prayer_surge') {
      // Prayer Surge — restore PP and boost Str+Def
      const ppRestored = Math.min(fx.ppRestore||40, (this.state.maxPp||99) - (this.state.prayerPoints||0));
      this.state.prayerPoints = Math.min(this.state.maxPp||99, (this.state.prayerPoints||0) + (fx.ppRestore||40));
      if (fx.statBoost) {
        c.activeBuffs.push({ stat:'strengthBonus', value:fx.statBoost||8, remaining:fx.duration||20, _maxDuration:fx.duration||20, type:'time' });
        c.activeBuffs.push({ stat:'defenceBonus',  value:fx.statBoost||8, remaining:fx.duration||20, _maxDuration:fx.duration||20, type:'time' });
      }
      this.emit('notification',{type:'success',text:`${ab.name}: Restored ${ppRestored} Prayer Points + Str/Def boost!`});
      this.emit('abilityUsed',{ability:ab, source:'buff'});
    }

    // Set cooldown and award tactics XP
    c.abilityCooldowns[id] = ab.cooldown;
    this.addXp('tactics', Math.max(5, Math.floor((ab.tacticsReq||1) * 0.5 + ab.cooldown * 0.5)));
  };

  // ── TICKBUFFS — handle type:'hits' correctly ─────────────────────
  // Replaces engine.js tickBuffs to handle hits-based buff consumption
  proto.tickBuffs = function(dt) {
    for (let i = this.state.combat.activeBuffs.length - 1; i >= 0; i--) {
      const buff = this.state.combat.activeBuffs[i];
      if (buff.type === 'hits') continue; // hits-based: consumed in playerAttack, not by time
      buff.remaining -= dt;
      if (buff.remaining <= 0) this.state.combat.activeBuffs.splice(i, 1);
    }
  };

  // ── GETPLAYERATTACKSPEED — fix speedBonus sign ───────────────────
  const _origGetSpeed = proto.getPlayerAttackSpeed;
  proto.getPlayerAttackSpeed = function() {
    const w = this.getEquippedItem('weapon');
    let speed = w ? (w.attackSpeed || 2.4) : 2.4;
    speed *= 0.6; // global 40% faster
    // speedBonus buff: positive value = % speed INCREASE = faster = lower interval
    for (const buff of this.state.combat.activeBuffs) {
      if (buff.stat === 'speedBonus') speed *= (1 - buff.value / 100);
    }
    const affixData = this.state._affixedItems?.[this.state.equipment?.weapon];
    if (affixData?.effects?.atkSpeedBonus) speed += affixData.effects.atkSpeedBonus;
    const freezeFx = this.state.combat.statusEffects?.player?.freeze;
    if (freezeFx?.stacks > 0) speed *= (1 + 0.10 * freezeFx.stacks);
    const mSlow = this.state.combat.statusEffects?.player?.slow;
    if (mSlow?.timer > 0) speed *= (1 + (mSlow.amount||0.20));
    return Math.max(0.4, speed);
  };

  // ── PLAYERATTACK — consume hits-based buffs + Maldrak passive ────
  const _origPlayerAttack = proto.playerAttack;
  proto.playerAttack = function(monster) {
    // Maldrak's passive: the lower your HP, the harder you hit
    const weapon = this.getEquippedItem('weapon');
    if (weapon?.passiveEffect?.type === 'maldrak') {
      const maxHp = this.getMaxHp();
      const curHp = this.state.combat.playerHp || maxHp;
      const missingPct = Math.max(0, (maxHp - curHp) / maxHp);
      const dharokMult = 1 + missingPct * 2; // up to ×3 at 1HP
      if (dharokMult > 1.01) {
        this.state.combat.activeBuffs.push({
          stat:'damageMult', value:dharokMult, remaining:1, type:'hits', _maldrak:true, _maxDuration:1
        });
      }
    }

    _origPlayerAttack.call(this, monster);

    // Consume type:'hits' buffs (Power Strike, Maldrak oneshot buff)
    for (let i = this.state.combat.activeBuffs.length - 1; i >= 0; i--) {
      const b = this.state.combat.activeBuffs[i];
      if (b.type === 'hits') {
        b.remaining--;
        if (b.remaining <= 0) this.state.combat.activeBuffs.splice(i, 1);
      }
    }
  };

  // ── MONSTERATACK — check dodgeCharges before attack ──────────────
  const _origMonsterAttack = proto.monsterAttack;
  proto.monsterAttack = function(monster) {
    // Void Step dodge check
    const dodgeBuff = this.state.combat.activeBuffs.find(b => b.stat === 'dodgeCharges');
    if (dodgeBuff && dodgeBuff.value > 0) {
      dodgeBuff.value--;
      dodgeBuff._dodges = dodgeBuff.value;
      if (dodgeBuff.value <= 0) {
        const idx = this.state.combat.activeBuffs.indexOf(dodgeBuff);
        if (idx >= 0) this.state.combat.activeBuffs.splice(idx, 1);
      }
      this.emit('combatHit',{who:'monster',dmg:0,miss:true,dodge:true});
      return;
    }
    _origMonsterAttack.call(this, monster);
  };

  // ── ONMONSTERDEATH — onKillHeal buff ────────────────────────────
  const _origOnMonsterDeath = proto.onMonsterDeath;
  proto.onMonsterDeath = function(monster, isWB) {
    _origOnMonsterDeath.call(this, monster, isWB);
    // Blood Frenzy heal on kill
    const healBuff = this.state.combat.activeBuffs.find(b => b.stat === 'onKillHeal');
    if (healBuff) {
      const healed = Math.floor(this.getMaxHp() * healBuff.value / 100);
      this.state.combat.playerHp = Math.min(this.getMaxHp(), this.state.combat.playerHp + healed);
      this.emit('notification',{type:'success',text:`Blood Frenzy: +${healed} HP from kill!`});
    }
  };

  // ── ADD MISSING SPEC ATTACK TYPES ───────────────────────────────
  const _origUseSpec = proto.useSpecialAttack;
  proto.useSpecialAttack = function() {
    const c = this.state.combat;
    if (!c.active || !c.monster) return;
    const weapon = this.getEquippedItem('weapon');
    if (!weapon?.specCost || !weapon.specEffect) {
      this.emit('notification',{type:'warn',text:'No special attack on this weapon.'}); return;
    }
    if ((this.state.specEnergy||0) < weapon.specCost) {
      this.emit('notification',{type:'warn',text:`Need ${weapon.specCost}% spec energy (have ${this.state.specEnergy||0}%).`}); return;
    }
    const monster = GAME_DATA.monsters[c.monster] || (GAME_DATA.worldBosses||[]).find(b=>b.id===c.monster);
    if (!monster) return;
    const spec = weapon.specEffect;

    // Handle spec types that engine.js doesn't know about
    const newTypes = ['triple_hit','void_reap','quadStab','blood_torrent','shadow_surge','magicLeech'];
    if (newTypes.includes(spec.type)) {
      this.state.specEnergy = (this.state.specEnergy||0) - weapon.specCost;

      if (spec.type === 'triple_hit' || spec.type === 'void_reap') {
        // Scythe / Veriax's Scythe — 3 hits at 100%/50%/25%
        const sL = this.state.skills.strength?.level || 1;
        const sB = this.getStatTotal('strengthBonus');
        const mh = Math.max(1, Math.floor((1+sL/10)*(1+sB/80)*4));
        const mults = [1.0, 0.5, 0.25];
        let total = 0;
        for (let i = 0; i < 3; i++) {
          const dmg = this.randInt(Math.floor(mh*mults[i]*0.2), Math.floor(mh*mults[i]));
          c.monsterHp -= dmg; total += dmg;
          this.emit('combatHit',{who:'player',dmg,crit:i===0,source:'spec'});
        }
        if (spec.healPct) {
          const heal = Math.floor(total * spec.healPct / 100);
          c.playerHp = Math.min(this.getMaxHp(), c.playerHp + heal);
          this.emit('notification',{type:'info',text:`${weapon.name}: ${total} total damage, healed ${heal} HP!`});
        } else {
          this.emit('notification',{type:'achievement',text:`${weapon.name}: 3 hits for ${total} total damage!`});
        }

      } else if (spec.type === 'quadStab') {
        // Ashen Rapier — 4 rapid stabs
        const aL = this.state.skills.attack?.level || 1;
        const sL = this.state.skills.strength?.level || 1;
        const sB = this.getStatTotal('strengthBonus');
        const mh = Math.max(1, Math.floor((1+sL/10)*(1+sB/80)*4*(spec.mult||0.9)));
        let total = 0;
        for (let i = 0; i < 4; i++) {
          const dmg = this.randInt(Math.floor(mh*0.1), mh);
          c.monsterHp -= dmg; total += dmg;
          this.emit('combatHit',{who:'player',dmg,crit:i===0,source:'spec'});
        }
        this.emit('notification',{type:'achievement',text:`Ashen Rapier: 4 stabs for ${total} total damage!`});

      } else if (spec.type === 'blood_torrent') {
        // Bloodfire Staff — 180% magic + 50% lifesteal
        const mB = this.getStatTotal('magicBonus');
        const mL = this.state.skills.magic?.level || 1;
        const mh = Math.max(1, Math.floor((mL*0.5+mB*0.4)*(spec.mult||1.8)));
        const dmg = this.randInt(Math.floor(mh*0.4), mh);
        c.monsterHp -= dmg;
        const heal = Math.floor(dmg * (spec.healPct||50) / 100);
        c.playerHp = Math.min(this.getMaxHp(), c.playerHp + heal);
        this.emit('combatHit',{who:'player',dmg,crit:true,source:'spec'});
        this.emit('notification',{type:'achievement',text:`Blood Torrent: ${dmg} damage, healed ${heal} HP!`});

      } else if (spec.type === 'shadow_surge') {
        // Tumeken's Shadow — 250% magic ignoring all defence
        const mB = this.getStatTotal('magicBonus');
        const mL = this.state.skills.magic?.level || 1;
        const mh = Math.max(1, Math.floor((mL*0.8+mB*0.6)*(spec.mult||2.5)));
        const dmg = this.randInt(Math.floor(mh*0.5), mh);
        c.monsterHp -= dmg;
        this.emit('combatHit',{who:'player',dmg,crit:true,source:'spec'});
        this.emit('notification',{type:'achievement',text:`Shadow Surge: ${dmg} void damage — all defence ignored!`});

      } else if (spec.type === 'magicLeech') {
        // Twisted Bow — scales with target magic level
        const magicScale = monster.magic || monster.combatLevel * 0.6 || 50;
        const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
        const rL = this.state.skills.ranged?.level || 1;
        const scaleMult = Math.min(3.0, 1.0 + magicScale / 100);
        const mh = Math.max(1, Math.floor((1+rL/10)*(1+rB/80)*4*scaleMult));
        for (let i = 0; i < 3; i++) {
          const dmg = this.randInt(Math.floor(mh*0.1*0.8), Math.floor(mh*0.8));
          c.monsterHp -= dmg;
          this.emit('combatHit',{who:'player',dmg,crit:i===0,source:'spec'});
          this.consumeAmmo();
        }
        this.emit('notification',{type:'achievement',text:`Twisted Bow spec — scales with target magic level ${Math.round(magicScale)}!`});
      }
      this.emit('notification',{type:'achievement',text:`SPECIAL ATTACK! (${this.state.specEnergy}% energy left)`});
    } else {
      // All other spec types handled by engine.js
      _origUseSpec.call(this);
    }
  };

  // ── DHAROK'S PASSIVE ────────────────────────────────────────────
  // The _origPlayerAttack wrapper above handles hit-based buff consumption.
  // Maldrak passive: we inject before the attack by modifying activeBuffs.
  // This is handled by checking the weapon in the hits-consuming wrapper above.

  console.log('[Ashfall] engine-combat.js v2 — abilities, buffs, specs, Maldrak all patched.');
})();

// ================================================================
// ASHFALL IDLE — UNIFIED MAGIC SYSTEM v1.0
// Rune-based spellcasting + Rune crafting progression
// Materials → Runes → Spells
// ================================================================

// ── RUNE SYSTEM ────────────────────────────────────────────────
// 8 rune types, each trained from different materials
const RUNE_SYSTEM = {
  runes: {
    mind: {
      id: 'mind',
      name: 'Mind Rune',
      color: '#7b68ee',
      material: 'essence_of_mind',
      materialName: 'Mind Essence',
      xpPerCraft: 15,
      baseTime: 2000, // 2 seconds
      levelRequired: 1
    },
    air: {
      id: 'air',
      name: 'Air Rune',
      color: '#87ceeb',
      material: 'essence_of_air',
      materialName: 'Air Essence',
      xpPerCraft: 18,
      baseTime: 2500,
      levelRequired: 5
    },
    water: {
      id: 'water',
      name: 'Water Rune',
      color: '#4169e1',
      material: 'essence_of_water',
      materialName: 'Water Essence',
      xpPerCraft: 20,
      baseTime: 2800,
      levelRequired: 10
    },
    earth: {
      id: 'earth',
      name: 'Earth Rune',
      color: '#8b4513',
      material: 'essence_of_earth',
      materialName: 'Earth Essence',
      xpPerCraft: 22,
      baseTime: 3000,
      levelRequired: 15
    },
    fire: {
      id: 'fire',
      name: 'Fire Rune',
      color: '#ff4500',
      material: 'essence_of_fire',
      materialName: 'Fire Essence',
      xpPerCraft: 25,
      baseTime: 3200,
      levelRequired: 20
    },
    body: {
      id: 'body',
      name: 'Body Rune',
      color: '#daa520',
      material: 'essence_of_body',
      materialName: 'Body Essence',
      xpPerCraft: 28,
      baseTime: 3500,
      levelRequired: 30
    },
    chaos: {
      id: 'chaos',
      name: 'Chaos Rune',
      color: '#dc143c',
      material: 'essence_of_chaos',
      materialName: 'Chaos Essence',
      xpPerCraft: 35,
      baseTime: 4000,
      levelRequired: 50
    },
    ancient: {
      id: 'ancient',
      name: 'Ancient Rune',
      color: '#4b0082',
      material: 'essence_of_ancient',
      materialName: 'Ancient Essence',
      xpPerCraft: 50,
      baseTime: 5000,
      levelRequired: 75
    }
  },

  getRuneById: function(runeId) {
    return this.runes[runeId];
  }
};

// ── SPELL RECIPES ──────────────────────────────────────────────
// Spell = combination of runes + mana cost
const SPELL_RECIPES = {
  // DETECTION SCHOOL (Level 1-25)
  detect_magic: {
    id: 'detect_magic',
    name: 'Detect Magic',
    school: 'detection',
    levelRequired: 1,
    manaCost: 5,
    runes: { mind: 1 },
    xpGain: 10,
    effect: 'Reveal hidden magic in the area',
    cooldown: 0
  },

  // COMBAT SCHOOL (Level 1-99)
  spark: {
    id: 'spark',
    name: 'Spark',
    school: 'combat',
    levelRequired: 1,
    manaCost: 8,
    runes: { mind: 1 },
    xpGain: 15,
    damage: [3, 8],
    effect: 'Small burst of fire'
  },

  fireball: {
    id: 'fireball',
    name: 'Fireball',
    school: 'combat',
    levelRequired: 20,
    manaCost: 16,
    runes: { mind: 1, fire: 2 },
    xpGain: 40,
    damage: [5, 15],
    effect: 'Medium AoE fire attack',
    areaOfEffect: 3
  },

  ice_bolt: {
    id: 'ice_bolt',
    name: 'Ice Bolt',
    school: 'combat',
    levelRequired: 25,
    manaCost: 15,
    runes: { mind: 1, water: 2 },
    xpGain: 35,
    damage: [4, 12],
    effect: 'Freezes target for 3 seconds',
    stun: 3000
  },

  meteor_strike: {
    id: 'meteor_strike',
    name: 'Meteor Strike',
    school: 'combat',
    levelRequired: 60,
    manaCost: 35,
    runes: { mind: 1, fire: 2, chaos: 1 },
    xpGain: 80,
    damage: [8, 20],
    effect: 'Massive fire impact',
    areaOfEffect: 5
  },

  // HEALING SCHOOL (Level 10-80)
  heal: {
    id: 'heal',
    name: 'Heal',
    school: 'healing',
    levelRequired: 10,
    manaCost: 15,
    runes: { mind: 1, water: 1, body: 1 },
    xpGain: 25,
    heals: [1, 20], // 1d20
    effect: 'Restore HP to self or ally'
  },

  restoration: {
    id: 'restoration',
    name: 'Restoration',
    school: 'healing',
    levelRequired: 40,
    manaCost: 30,
    runes: { mind: 2, water: 2, body: 1 },
    xpGain: 60,
    heals: [3, 20],
    effect: 'Massive HP recovery',
    cureFocus: true // removes status effects
  },

  // SUPPORT SCHOOL (Level 15-85)
  strength_boost: {
    id: 'strength_boost',
    name: 'Strength Boost',
    school: 'support',
    levelRequired: 15,
    manaCost: 12,
    runes: { mind: 1, body: 1, earth: 1 },
    xpGain: 20,
    effect: '+25% damage for 60 seconds',
    buffDuration: 60000,
    buffStat: 'strength',
    buffMultiplier: 1.25
  },

  protection: {
    id: 'protection',
    name: 'Protection',
    school: 'support',
    levelRequired: 25,
    manaCost: 20,
    runes: { mind: 2, earth: 1, body: 1 },
    xpGain: 35,
    effect: '-20% damage taken for 45 seconds',
    buffDuration: 45000,
    buffStat: 'defence',
    buffReduction: 0.2
  },

  haste: {
    id: 'haste',
    name: 'Haste',
    school: 'support',
    levelRequired: 50,
    manaCost: 35,
    runes: { mind: 2, air: 2 },
    xpGain: 70,
    effect: '+40% attack speed for 30 seconds',
    buffDuration: 30000,
    buffStat: 'speed',
    buffMultiplier: 1.4
  },

  // UTILITY SCHOOL (Level 5-99)
  light: {
    id: 'light',
    name: 'Light',
    school: 'utility',
    levelRequired: 5,
    manaCost: 5,
    runes: { air: 1 },
    xpGain: 8,
    effect: 'Illuminate dark areas'
  },

  teleport: {
    id: 'teleport',
    name: 'Teleport',
    school: 'utility',
    levelRequired: 45,
    manaCost: 25,
    runes: { mind: 1, air: 2, ancient: 1 },
    xpGain: 65,
    effect: 'Instantly escape from combat',
    canUseInCombat: false
  }
};

// ── SPELL SCHOOLS ─────────────────────────────────────────────
const SPELL_SCHOOLS = {
  detection: {
    id: 'detection',
    name: 'Detection',
    icon: '👁',
    color: '#7b68ee',
    description: 'Reveal hidden magic and objects'
  },
  combat: {
    id: 'combat',
    name: 'Combat',
    icon: '⚡',
    color: '#ff4500',
    description: 'Offensive spells for battle'
  },
  healing: {
    id: 'healing',
    name: 'Healing',
    icon: '✨',
    color: '#00ff7f',
    description: 'Restore health and cure ailments'
  },
  support: {
    id: 'support',
    name: 'Support',
    icon: '🛡',
    color: '#4169e1',
    description: 'Buffs and protection'
  },
  utility: {
    id: 'utility',
    name: 'Utility',
    icon: '🌟',
    color: '#daa520',
    description: 'Practical magic outside combat'
  }
};

// ── RUNE CRAFTING RECIPES ──────────────────────────────────────
// Materials needed to craft each rune
const RUNE_CRAFTING_RECIPES = {
  mind: {
    runeId: 'mind',
    level: 1,
    materials: { ethereal_dust: 2 },
    time: 2000,
    xp: 15
  },
  air: {
    runeId: 'air',
    level: 5,
    materials: { ethereal_dust: 3, wind_shard: 1 },
    time: 2500,
    xp: 18
  },
  water: {
    runeId: 'water',
    level: 10,
    materials: { ethereal_dust: 3, water_shard: 1 },
    time: 2800,
    xp: 20
  },
  earth: {
    runeId: 'earth',
    level: 15,
    materials: { ethereal_dust: 4, earth_shard: 1 },
    time: 3000,
    xp: 22
  },
  fire: {
    runeId: 'fire',
    level: 20,
    materials: { ethereal_dust: 4, fire_shard: 2 },
    time: 3200,
    xp: 25
  },
  body: {
    runeId: 'body',
    level: 30,
    materials: { ethereal_dust: 5, soul_fragment: 1 },
    time: 3500,
    xp: 28
  },
  chaos: {
    runeId: 'chaos',
    level: 50,
    materials: { ethereal_dust: 6, chaos_shard: 2 },
    time: 4000,
    xp: 35
  },
  ancient: {
    runeId: 'ancient',
    level: 75,
    materials: { ethereal_dust: 8, ancient_shard: 3 },
    time: 5000,
    xp: 50
  }
};

// ── ENGINE METHODS ────────────────────────────────────────────
// Rune crafting
GameEngine.prototype.craftRune = function(runeId, level) {
  return tryOperation(() => {
    const recipe = RUNE_CRAFTING_RECIPES[runeId];
    if (!recipe) throw new Error(`Unknown rune: ${runeId}`);
    
    // Check level
    if (level < recipe.level) {
      throw new Error(`Need Magic level ${recipe.level} to craft ${runeId}`);
    }

    // Check materials
    for (const [matId, count] of Object.entries(recipe.materials)) {
      if (!this.state.inventory[matId] || this.state.inventory[matId].count < count) {
        throw new Error(`Need ${count}x ${matId}`);
      }
    }

    // Consume materials
    for (const [matId, count] of Object.entries(recipe.materials)) {
      this.state.inventory[matId].count -= count;
      if (this.state.inventory[matId].count <= 0) {
        delete this.state.inventory[matId];
      }
    }

    // Gain rune
    const runeItem = `rune_${runeId}`;
    if (!this.state.inventory[runeItem]) {
      this.state.inventory[runeItem] = { id: runeItem, count: 0, type: 'rune' };
    }
    this.state.inventory[runeItem].count += 1;

    // Gain XP
    this.addXP('magic', recipe.xp);

    this.emit('runeCrafted', { rune: runeId, xp: recipe.xp });
    return { rune: runeId, xp: recipe.xp };
  });
};

// Cast spell (consume runes + mana)
GameEngine.prototype.castSpell = function(spellId, targetId) {
  return tryOperation(() => {
    const spell = SPELL_RECIPES[spellId];
    if (!spell) throw new Error(`Unknown spell: ${spellId}`);

    const magicLevel = this.state.skills.magic.level;
    
    console.log('[Magic] Casting ' + spellId);
    console.log('[Magic]   Level required: ' + spell.levelRequired + ', Have: ' + magicLevel);
    console.log('[Magic]   Mana cost: ' + spell.manaCost + ', Have: ' + (this.state.combat.mana?.current || 0));
    
    // Check requirements
    if (magicLevel < spell.levelRequired) {
      throw new Error(`Need Magic ${spell.levelRequired} (have ${magicLevel})`);
    }

    // Check mana
    if (!this.state.combat.mana || this.state.combat.mana.current < spell.manaCost) {
      throw new Error(`Need ${spell.manaCost} mana (have ${this.state.combat.mana?.current || 0})`);
    }

    // Check runes
    for (const [runeId, count] of Object.entries(spell.runes)) {
      const runeItem = `rune_${runeId}`;
      if (!this.state.inventory[runeItem] || this.state.inventory[runeItem].count < count) {
        throw new Error(`Need ${count}x ${runeId} rune`);
      }
    }

    // Consume mana
    const manaBefore = this.state.combat.mana.current;
    this.state.combat.mana.current -= spell.manaCost;
    console.log('[Magic]   Mana CONSUMED: ' + manaBefore + ' -> ' + this.state.combat.mana.current);

    // Consume runes
    for (const [runeId, count] of Object.entries(spell.runes)) {
      const runeItem = `rune_${runeId}`;
      this.state.inventory[runeItem].count -= count;
      console.log('[Magic]   Rune consumed: ' + runeId + ' (' + count + ')');
      if (this.state.inventory[runeItem].count <= 0) {
        delete this.state.inventory[runeItem];
      }
    }

    // Gain XP
    this.addXP('magic', spell.xpGain);
    console.log('[Magic]   XP gained: ' + spell.xpGain);

    this.emit('spellCast', { 
      spell: spellId,
      target: targetId,
      xp: spell.xpGain,
      damage: spell.damage,
      heals: spell.heals
    });

    return { spell: spellId, xp: spell.xpGain };
  });
};

// Get available spells for current level
GameEngine.prototype.getAvailableSpells = function() {
  const magicLevel = this.state.skills.magic.level;
  return Object.values(SPELL_RECIPES).filter(s => s.levelRequired <= magicLevel);
};

// Get spell by school
GameEngine.prototype.getSpellsBySchool = function(schoolId) {
  const magicLevel = this.state.skills.magic.level;
  return Object.values(SPELL_RECIPES).filter(
    s => s.school === schoolId && s.levelRequired <= magicLevel
  );
};

// ── LOGGING ────────────────────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Unified Magic System loaded');
  console.log('  Runes: ' + Object.keys(RUNE_SYSTEM.runes).length);
  console.log('  Spells: ' + Object.keys(SPELL_RECIPES).length);
  console.log('  Schools: ' + Object.keys(SPELL_SCHOOLS).length);
  console.log('  Rune recipes: ' + Object.keys(RUNE_CRAFTING_RECIPES).length);
}

// Export
window.MAGIC_SYSTEM = {
  RUNE_SYSTEM,
  SPELL_RECIPES,
  SPELL_SCHOOLS,
  RUNE_CRAFTING_RECIPES
};

// ================================================================
// ASHFALL IDLE — SPELL DAMAGE HANDLER
// Listens to spellCast event and applies damage to current enemy
// ================================================================

(function() {
  'use strict';

  // Helper: roll dice damage [min, max]
  function rollDamage(minDmg, maxDmg) {
    if (Array.isArray(minDmg)) {
      return Math.floor(Math.random() * (minDmg[1] - minDmg[0] + 1)) + minDmg[0];
    }
    return minDmg;
  }

  // Initialize spell damage listener — poll for engine (game) with hard cap
  let _spellDmgRetries = 0;
  const MAX_RETRIES = 50; // 5 seconds max
  function initSpellDamageListener() {
    // Engine is exposed as 'game' (const game = new GameEngine() in engine.js)
    const eng = window.game;
    if (!eng) {
      if (++_spellDmgRetries > MAX_RETRIES) {
        console.warn('[Spell Damage] Engine never became ready — giving up.');
        return;
      }
      setTimeout(initSpellDamageListener, 100);
      return;
    }

    console.log('[Spell Damage] Handler initialized - listening for spellCast events');

    // Listen for spell cast events
    eng.on('spellCast', function handleSpellCast(event) {
        try {
          console.log('[Spell Damage] Spell cast event received:', event.spell);

          // Get current enemy being fought
          const currentEnemy = eng.state.currentEnemy;
          if (!currentEnemy) {
            console.log('[Spell Damage] No current enemy - spell has no effect');
            return;
          }

          // Get spell definition
          const spellId = event.spell;
          const SPELL_RECIPES = window.SPELL_RECIPES || {};
          const spell = SPELL_RECIPES[spellId];

          if (!spell) {
            console.warn('[Spell Damage] Spell not found:', spellId);
            return;
          }

          // ━━━ DAMAGE SPELLS ━━━
          if (spell.damage) {
            const damageRolled = rollDamage(spell.damage);
            const actualDamage = Math.max(1, damageRolled); // minimum 1 damage

            console.log('[Spell Damage] ' + spell.name + ' hit for ' + actualDamage + ' damage');
            console.log('[Spell Damage] Enemy HP before:', currentEnemy.hp);

            // Apply damage to enemy
            currentEnemy.hp -= actualDamage;
            console.log('[Spell Damage] Enemy HP after:', currentEnemy.hp);

            // Emit damage event for UI updates
            eng.emit('damageDealt', {
              source: 'spell',
              spellId: spellId,
              damage: actualDamage,
              target: currentEnemy.id
            });

            // Check if enemy died
            if (currentEnemy.hp <= 0) {
              console.log('[Spell Damage] Enemy defeated by spell!');
              eng.emit('enemyDefeated', {
                enemy: currentEnemy,
                killedBy: 'spell',
                spell: spellId
              });
            }
          }

          // ━━━ HEALING SPELLS ━━━
          if (spell.heals) {
            const healingRolled = rollDamage(spell.heals);
            const playerMaxHp = eng.state.stats.hitpoints?.current || eng.state.stats.hitpoints || 100;
            const playerCurrentHp = eng.state.hp || playerMaxHp;

            const actualHealing = Math.min(healingRolled, playerMaxHp - playerCurrentHp);
            console.log('[Spell Damage] ' + spell.name + ' healed for ' + actualHealing + ' HP');

            eng.state.hp = (playerCurrentHp || 0) + actualHealing;

            eng.emit('playerHealed', {
              spellId: spellId,
              healing: actualHealing
            });
          }

          // ━━━ BUFF SPELLS ━━━
          if (spell.buffStat && spell.buffDuration) {
            console.log('[Spell Damage] ' + spell.name + ' applied buff: ' + spell.buffStat);

            // Create buff
            const buffId = 'spell_' + spellId + '_' + Date.now();
            if (!eng.state.buffs) eng.state.buffs = [];

            eng.state.buffs.push({
              id: buffId,
              spell: spellId,
              name: spell.name,
              stat: spell.buffStat,
              multiplier: spell.buffMultiplier,
              reduction: spell.buffReduction,
              duration: spell.buffDuration,
              startTime: Date.now()
            });

            eng.emit('buffApplied', {
              spell: spellId,
              buffStat: spell.buffStat
            });
          }

          // ━━━ STUN/CC SPELLS ━━━
          if (spell.stun) {
            console.log('[Spell Damage] ' + spell.name + ' stunned enemy for ' + spell.stun + 'ms');
            currentEnemy.stunned = true;
            currentEnemy.stunEnd = Date.now() + spell.stun;

            eng.emit('enemyStunned', {
              enemy: currentEnemy.id,
              duration: spell.stun
            });
          }

        } catch (error) {
          console.error('[Spell Damage] Error handling spell cast:', error);
        }
      });

  }
  setTimeout(initSpellDamageListener, 200);

  console.log('[Spell Damage Handler] Script loaded');

})();

// ================================================================
// ASHFALL IDLE — Skills Integration Layer
// Connect skill overhaul systems to game engine
// Handles mana, spell casting, weapon types, ammo, quality items
// ================================================================

// ── MANA SYSTEM INTEGRATION ────────────────────────────────────
GameEngine.prototype.initManaSystem = function() {
  if (!this.state.combat.mana) {
    this.state.combat.mana = {
      current: MANA_SYSTEM.maxManaBase,
      max: MANA_SYSTEM.maxManaBase,
      regenRate: MANA_SYSTEM.manaRegenPerSecond,
      lastRegenTime: Date.now()
    };
  }
};

GameEngine.prototype.tickMana = function(dtRaw) {
  if (!this.state.combat || !this.state.combat.mana) return;

  // Guard dt — NaN/invalid dt must not re-poison mana after we fix current below
  const dt = (typeof dtRaw === 'number' && isFinite(dtRaw) && dtRaw > 0) ? dtRaw : 0;

  const mana = this.state.combat.mana;

  // Safety clamps — only log once per session to avoid console spam
  if (typeof mana.max !== 'number' || mana.max <= 0 || isNaN(mana.max)) mana.max = 100;
  if (typeof mana.regenRate !== 'number' || isNaN(mana.regenRate)) mana.regenRate = 1;
  if (typeof mana.current !== 'number' || isNaN(mana.current)) mana.current = mana.max;

  // Regen
  mana.current = Math.min(mana.max, Math.max(0, mana.current + (mana.regenRate * dt / 1000)));
};

GameEngine.prototype.getManaPercent = function() {
  if (!this.state.combat || !this.state.combat.mana) return 100;
  const mana = this.state.combat.mana;
  if (!mana.max || mana.max === 0) return 100;
  const percent = (mana.current / mana.max) * 100;
  return isNaN(percent) ? 100 : Math.min(100, Math.max(0, percent));
};

GameEngine.prototype.canCastSpell = function(spellId, schoolId) {
  const school = MANA_SYSTEM.spellSchools[schoolId];
  if (!school) {
    errorHandler.handleError(new AshfallError(
      'SPELL_SCHOOL_NOT_FOUND',
      'Spell school does not exist',
      { schoolId },
      'warn'
    ));
    return false;
  }
  
  const spell = school.spells.find(s => s.id === spellId);
  if (!spell) {
    errorHandler.handleError(new AshfallError(
      'SPELL_NOT_FOUND',
      'Spell not found in school',
      { spellId, schoolId },
      'warn'
    ));
    return false;
  }
  
  const magicLevel = this.getSkillLevel('magic');
  if (magicLevel < spell.level) {
    errorHandler.handleError(new AshfallError(
      'SPELL_LEVEL_INSUFFICIENT',
      `Magic level ${spell.level} required for ${spell.name}`,
      { spell: spellId, required: spell.level, current: magicLevel },
      'warn'
    ));
    return false;
  }
  
  if (this.state.combat.mana.current < spell.manaCost) {
    errorHandler.handleError(new AshfallError(
      'INSUFFICIENT_MANA',
      `${spell.manaCost} mana required, only have ${Math.floor(this.state.combat.mana.current)}`,
      { spell: spellId, required: spell.manaCost, current: Math.floor(this.state.combat.mana.current) },
      'warn'
    ));
    return false;
  }
  
  return true;
};

GameEngine.prototype.castSpell = function(spellId, schoolId, target = null) {
  return tryOperation(() => {
    if (!this.canCastSpell(spellId, schoolId)) return false;
    
    const school = MANA_SYSTEM.spellSchools[schoolId];
    const spell = school.spells.find(s => s.id === spellId);
    
    // Consume mana
    this.state.combat.mana.current -= spell.manaCost;
    
    // Apply spell effect
    if (spell.damage) {
      const damage = this._calculateSpellDamage(spell, this.getSkillLevel('magic'));
      this.dealDamage(target, damage);
      this.addXp('magic', spell.level * 2);
    } else if (spell.healing) {
      const healing = spell.healing + (this.getSkillLevel('magic') / 10);
      this.state.hitpoints = Math.min(this.getHitpointsCap(), this.state.hitpoints + healing);
      this.addXp('magic', spell.level);
    } else if (spell.effect) {
      this._applySpellEffect(spell, target);
    }
    
    this.emit('spellCast', { spell: spellId, school: schoolId, manaUsed: spell.manaCost });
    return true;
  }, 'SPELL_CAST_FAILED', { spellId, schoolId });
};

GameEngine.prototype._calculateSpellDamage = function(spell, magicLevel) {
  const baseBonus = 1 + (magicLevel / 100);
  return spell.damage * baseBonus;
};

// ── WEAPON SYSTEM INTEGRATION ──────────────────────────────────
GameEngine.prototype.setWeaponType = function(weaponTypeId) {
  const weaponType = SKILL_WEAPON_TYPES[weaponTypeId];
  if (!weaponType) {
    errorHandler.handleError(new AshfallError(
      'INVALID_WEAPON_TYPE',
      'Weapon type does not exist',
      { weaponTypeId },
      'warn'
    ));
    return false;
  }
  
  this.state.combat.weaponType = weaponTypeId;
  this.emit('weaponChanged', weaponType);
  return true;
};

GameEngine.prototype.getWeaponBonus = function(stat) {
  const weaponType = SKILL_WEAPON_TYPES[this.state.combat.weaponType];
  if (!weaponType) return 1.0;
  
  const bonuses = {
    damage: weaponType.damage || 1.0,
    speed: weaponType.speed || 1.0,
    accuracy: weaponType.accuracy || 1.0,
    spellDamage: weaponType.spellDamage || 1.0,
  };
  
  return bonuses[stat] || 1.0;
};

// ── AMMO SYSTEM INTEGRATION ────────────────────────────────────
GameEngine.prototype.getAmmoCount = function(ammoId) {
  const count = this.state.inventory[ammoId];
  return count ? count.qty : 0;
};

GameEngine.prototype.consumeAmmo = function(ammoTypeId, count = 1) {
  if (!this.state.inventory[ammoTypeId] || this.state.inventory[ammoTypeId].qty < count) {
    errorHandler.handleError(new AshfallError(
      'INSUFFICIENT_AMMO',
      `Not enough ${ammoTypeId}`,
      { ammoType: ammoTypeId, needed: count, have: this.getAmmoCount(ammoTypeId) },
      'warn'
    ));
    return false;
  }
  
  this.state.inventory[ammoTypeId].qty -= count;
  if (this.state.inventory[ammoTypeId].qty <= 0) {
    delete this.state.inventory[ammoTypeId];
  }
  this.emit('ammoConsumed', { ammoType: ammoTypeId, count });
  return true;
};

GameEngine.prototype.checkAmmoRequirement = function(weaponTypeId) {
  const weaponType = SKILL_WEAPON_TYPES[weaponTypeId];
  if (!weaponType || !weaponType.ammoType) return true; // Not a ranged weapon
  
  const ammoCount = this.getAmmoCount(weaponType.ammoType);
  if (ammoCount <= 0) {
    errorHandler.handleError(new AshfallError(
      'OUT_OF_AMMO',
      `Out of ${weaponType.ammoType}. Equip a melee weapon or get more ammo.`,
      { weaponType: weaponTypeId, ammoType: weaponType.ammoType },
      'warn'
    ));
    return false;
  }
  
  return true;
};

// ── QUALITY SYSTEM FOR CRAFTING ────────────────────────────────
GameEngine.prototype.craftWithQuality = function(recipeId, skillId) {
  return tryOperation(() => {
    const skill = GAME_DATA.skills[skillId];
    if (!skill) throw new AshfallError('SKILL_NOT_FOUND', 'Skill does not exist', { skillId }, 'warn');
    
    const skillLevel = this.getSkillLevel(skillId);
    const qualityChances = SKILL_SYSTEMS.getQualityTierChance(skillLevel);
    
    // Determine quality tier
    let quality = 'normal';
    const roll = Math.random();
    let cumulative = 0;
    
    for (const [tier, chance] of Object.entries(qualityChances)) {
      cumulative += chance;
      if (roll < cumulative) {
        quality = tier;
        break;
      }
    }
    
    const qualityBonus = QUALITY_TIERS[quality].bonus;
    
    this.emit('craftQuality', {
      recipe: recipeId,
      quality: quality,
      bonus: qualityBonus,
      skill: skillId
    });
    
    return {
      quality: quality,
      bonus: qualityBonus,
      name: QUALITY_TIERS[quality].name
    };
  }, 'CRAFT_WITH_QUALITY_FAILED', { recipeId, skillId });
};

// ── COOKING SYSTEM ENHANCEMENTS ────────────────────────────────
GameEngine.prototype.cookMeal = function(itemId, skillLevel) {
  const qualityResult = this.craftWithQuality(itemId, 'cooking');
  if (!qualityResult) return null;
  
  const cookedFood = {
    id: itemId,
    quality: qualityResult.quality,
    freshness: 1.0,
    cookedAt: Date.now(),
    degradationStage: 0
  };
  
  return cookedFood;
};

GameEngine.prototype.tickFoodDegradation = function() {
  try {
    if (typeof COOKING_IMPROVEMENTS === 'undefined' || !COOKING_IMPROVEMENTS.foodDegradation) return;
    
    const timePerStage = COOKING_IMPROVEMENTS.degradationTimeMinutes * 60 * 1000;
  const now = Date.now();
  
  for (const [itemId, item] of Object.entries(this.state.inventory)) {
    if (item.cookedAt && GAME_DATA.items[itemId]?.type === 'food') {
      const timeElapsed = now - item.cookedAt;
      const stage = Math.floor(timeElapsed / timePerStage);
      
      if (stage >= 4) {
        // Food is completely spoiled
        delete this.state.inventory[itemId];
      } else if (stage !== item.degradationStage) {
        item.degradationStage = stage;
        this.emit('foodDegraded', { item: itemId, stage });
      }
    }
  }
  } catch (e) {
    // Silently fail if COOKING_IMPROVEMENTS not ready
  }
};

// ── HERBLORE QUALITY & FAILURE ────────────────────────────────
GameEngine.prototype.brewPotion = function(recipeId, herbloreLevel) {
  return tryOperation(() => {
    const failureChance = HERBLORE_IMPROVEMENTS.getFailureChance(herbloreLevel);
    
    if (Math.random() < failureChance) {
      this.emit('potionBrewed', {
        recipe: recipeId,
        quality: 'failed',
        effect: 0.5 // Failed potion = 50% effect
      });
      return { quality: 'failed', effectiveness: 0.5 };
    }
    
    const qualityChances = HERBLORE_IMPROVEMENTS.qualityChances(herbloreLevel);
    let quality = 'normal';
    let effectiveness = 1.0;
    
    const roll = Math.random();
    if (roll < qualityChances.perfect) {
      quality = 'perfect';
      effectiveness = 2.0;
    } else if (roll < qualityChances.perfect + qualityChances.enhanced) {
      quality = 'enhanced';
      effectiveness = 1.5;
    }
    
    this.emit('potionBrewed', {
      recipe: recipeId,
      quality: quality,
      effect: effectiveness
    });
    
    return { quality, effectiveness };
  }, 'POTION_BREWING_FAILED', { recipeId, herbloreLevel });
};

// ── FARMING IMPROVEMENTS ───────────────────────────────────────
GameEngine.prototype.plantCrop = function(plotId, cropId, farmingLevel) {
  const crop = FARMING_IMPROVEMENTS.cropVarieties.find(c => c.id === cropId);
  if (!crop) {
    errorHandler.handleError(new AshfallError(
      'CROP_NOT_FOUND',
      'Crop type does not exist',
      { cropId },
      'warn'
    ));
    return false;
  }
  
  if (farmingLevel < crop.level) {
    errorHandler.handleError(new AshfallError(
      'CROP_LEVEL_INSUFFICIENT',
      `Farming level ${crop.level} required`,
      { crop: cropId, required: crop.level, current: farmingLevel },
      'warn'
    ));
    return false;
  }
  
  this.state.farming.plots[plotId] = {
    cropId: cropId,
    plantedAt: Date.now(),
    growthTime: crop.growTime * 60 * 1000, // Convert minutes to ms
    diseased: false,
    yield: crop.yield
  };
  
  this.emit('cropPlanted', { plot: plotId, crop: cropId });
  return true;
};

GameEngine.prototype.checkCropDisease = function(plotId) {
  if (!FARMING_IMPROVEMENTS.diseaseSystem.enabled) return false;
  
  const plot = this.state.farming.plots[plotId];
  if (!plot) return false;
  
  if (Math.random() < FARMING_IMPROVEMENTS.diseaseSystem.diseaseChance) {
    plot.diseased = true;
    this.emit('cropDiseased', { plot: plotId });
    return true;
  }
  
  return false;
};

// ── SUMMONING FAMILIAR SYSTEM ──────────────────────────────────
GameEngine.prototype.summonFamiliar = function(familiarId, summoningLevel) {
  const familiar = SUMMONING_IMPROVEMENTS.familiarTypes.find(f => f.id === familiarId);
  if (!familiar) {
    errorHandler.handleError(new AshfallError(
      'FAMILIAR_NOT_FOUND',
      'Familiar type does not exist',
      { familiarId },
      'warn'
    ));
    return false;
  }
  
  if (summoningLevel < familiar.level) {
    errorHandler.handleError(new AshfallError(
      'SUMMONING_LEVEL_INSUFFICIENT',
      `Summoning level ${familiar.level} required`,
      { familiar: familiarId, required: familiar.level, current: summoningLevel },
      'warn'
    ));
    return false;
  }
  
  this.state.combat.familiar = {
    id: familiarId,
    name: familiar.name,
    hp: familiar.level * 3,
    maxHp: familiar.level * 3,
    combatStyle: familiar.combat,
    special: familiar.special,
    summonedAt: Date.now()
  };
  
  this.emit('familiarSummoned', { familiar: familiarId });
  return true;
};

// ── TICK INTEGRATION ───────────────────────────────────────────
// Hook into main engine tick
const originalEngineTick = GameEngine.prototype.tick;
GameEngine.prototype.tick = function(now, prevNow) {
  // Initialize mana on first tick if not done
  if (!this.state.combat.mana) {
    this.state.combat.mana = {
      current: 100,
      max: 100,
      regenRate: 1,
      lastRegenTime: Date.now()
    };
  }
  
  const result = originalEngineTick.call(this, now, prevNow);
  
  // New systems tick
  this.tickMana(now - prevNow);
  this.tickFoodDegradation();
  
  return result;
};

// ── LOGGING ────────────────────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Skills Integration Layer loaded');
  console.log('  Mana system integrated: ✓');
  console.log('  Weapon system integrated: ✓');
  console.log('  Ammo system integrated: ✓');
  console.log('  Quality crafting integrated: ✓');
  console.log('  Spell casting ready: ✓');
  console.log('  Familiar summoning ready: ✓');
}
