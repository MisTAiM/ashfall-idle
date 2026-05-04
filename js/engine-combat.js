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
      c.activeBuffs.push({ stat:fx.stat, value:fx.value, remaining:fx.hits||1, _maxDuration:fx.hits||1, type:'hits', _hitsLeft:fx.hits||1 });
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

  // ── PLAYERATTACK — consume hits-based buffs + Dharok passive ────
  const _origPlayerAttack = proto.playerAttack;
  proto.playerAttack = function(monster) {
    // Dharok's passive: the lower your HP, the harder you hit
    const weapon = this.getEquippedItem('weapon');
    if (weapon?.passiveEffect?.type === 'dharok') {
      const maxHp = this.getMaxHp();
      const curHp = this.state.combat.playerHp || maxHp;
      const missingPct = Math.max(0, (maxHp - curHp) / maxHp);
      const dharokMult = 1 + missingPct * 2; // up to ×3 at 1HP
      if (dharokMult > 1.01) {
        this.state.combat.activeBuffs.push({
          stat:'damageMult', value:dharokMult, remaining:1, type:'hits', _dharok:true, _maxDuration:1
        });
      }
    }

    _origPlayerAttack.call(this, monster);

    // Consume type:'hits' buffs (Power Strike, Dharok oneshot buff)
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
  // Dharok passive: we inject before the attack by modifying activeBuffs.
  // This is handled by checking the weapon in the hits-consuming wrapper above.

  console.log('[Ashfall] engine-combat.js v2 — abilities, buffs, specs, Dharok all patched.');
})();
