const {test,expect}=require('@playwright/test');

test.use({viewport:{width:390,height:844},launchOptions:{executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'}});

test('v8 mobile battle and four-character 3D dossier',async({page})=>{
 const errors=[],failed=[],external=[];
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('pageerror',e=>console.log('PAGEERROR',e.message));
 page.on('requestfailed',r=>failed.push(`${r.url()} ${r.failure()?.errorText}`));
 page.on('request',r=>{const u=new URL(r.url());if(['http:','https:'].includes(u.protocol)&&!['127.0.0.1','localhost'].includes(u.hostname))external.push(r.url())});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await expect(page.locator('.topbar')).toBeVisible();
 await page.locator('[data-tab="heroes"]').click();
 await expect(page.locator('.v8-preview-canvas')).toBeVisible();
 for(const id of['ash','taro','noa','mei']){
   await page.locator(`[data-v8-hero="${id}"]`).click();
   await expect(page.locator(`[data-v8-hero="${id}"]`)).toHaveAttribute('aria-selected','true');
   await page.waitForTimeout(250);
 }
 await page.screenshot({path:'screenshots/v8-mobile-characters.png',fullPage:true});
 const beforeTeam=(await page.evaluate(()=>window.__watchtower.state())).team.join(',');
 await page.locator('button[data-act="duty"]:not([disabled])').first().click();
 expect((await page.evaluate(()=>window.__watchtower.state())).team.join(',')).not.toBe(beforeTeam);
 await page.locator('[data-tab="campaign"]').click();
 await expect(page.locator('.v8-battle-canvas')).toBeVisible();
 await page.locator('[data-act="battle"]').click();
 await page.waitForFunction(()=>window.__watchtower.state().tactical.phase==='live');
 await page.waitForTimeout(2200);
 const state=await page.evaluate(()=>window.__watchtower.state());
 expect(state.tactical.wave).toBeGreaterThanOrEqual(1);
 expect(state.tactical.spawned).toBeGreaterThan(0);
 expect(await page.locator('.v8-battle-canvas').evaluate(c=>c.width>0&&c.height>0)).toBeTruthy();
 await page.evaluate(()=>{const s=window.__watchtower.state(); if(s.tactical.formation[0]){s.tactical.formation[0].readyAt=0} });
 await page.evaluate(()=>{const s=window.__watchtower.state(); return s.tactical.formation.length});
 await page.locator('.unit-card').first().click();
 await expect(page.locator('.battlefield')).toHaveClass(/aiming/);
 await page.locator('.field-input').click({position:{x:195,y:180}});
 await expect(page.locator('.battlefield')).not.toHaveClass(/aiming/);
 await page.evaluate(()=>window.__watchtower.forceUpgrade());
 await expect(page.locator('.upgrade-prompt')).toBeVisible();
 await page.locator('.upgrade-card').first().click();
 await page.screenshot({path:'screenshots/v8-mobile-battle.png',fullPage:true});
 expect(errors).toEqual([]);expect(failed).toEqual([]);expect(external).toEqual([]);
});

test('desktop and v7 save migration/fallback contract',async({page})=>{
 await page.setViewportSize({width:1280,height:900});
 await page.addInitScript(()=>localStorage.setItem('wasteland-watchtower-v7',JSON.stringify({v:7,tab:'base',chapter:2,scrap:999,cells:80,beacon:20,idleAt:Date.now(),buildings:{tower:2,yard:2,bunker:2,forge:2},owned:{ash:{lv:5,star:1,frag:0},mei:{lv:4,star:1,frag:0},bruno:{lv:3,star:1,frag:0}},team:['ash','mei','bruno']})));
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await expect(page.locator('.game')).toBeVisible();
 expect(await page.evaluate(()=>window.__watchtowerV8.version)).toBe(8);
 expect((await page.evaluate(()=>window.__watchtower.state())).scrap).toBeGreaterThanOrEqual(999);
 await page.locator('[data-tab="campaign"]').click();
 await expect(page.locator('.field-input')).toBeVisible();
 await page.screenshot({path:'screenshots/v8-desktop-battle.png',fullPage:true});
 const fallback=await page.evaluate(()=>{const c=document.createElement('div');c.className='v8-fallback';c.textContent='fallback test';document.querySelector('.battlefield').prepend(c);return !!document.querySelector('[data-act="battle"], [data-act="repair"]')});
 expect(fallback).toBeTruthy();
});

test('v9 portrait field reconciles 1, 3, and 7 defenders while enemies advance downward',async({page})=>{
 await page.goto('http://127.0.0.1:4173/?smoke=1',{waitUntil:'networkidle'});
 await page.locator('[data-tab="campaign"]').click();
 await expect(page.locator('.v8-battle-canvas')).toBeVisible();
 const field=await page.locator('.battlefield').boundingBox();
 expect(field.height/field.width).toBeGreaterThan(1.45);

 for(const count of[1,3,7]){
   await page.evaluate(n=>window.__watchtower.smokeFormation(n),count);
   await page.waitForFunction(n=>window.__watchtowerV9?.battleSnapshot()?.unitCount===n,count);
   const snapshot=await page.evaluate(()=>window.__watchtowerV9.battleSnapshot());
   expect(snapshot.formationCount).toBe(count);
   expect(snapshot.unitCount).toBe(count);
   expect(snapshot.units.every(unit=>unit.screenY>.62)).toBeTruthy();
   await page.waitForTimeout(150);
   await page.screenshot({path:`test-results/v9-mobile-${count}-defenders.png`,fullPage:true});
 }

 await page.evaluate(()=>window.__watchtower.smokeFormation(3));
 await page.locator('[data-act="battle"]').click();
 await page.locator('[data-act="summon"]').click();
 await page.waitForFunction(()=>window.__watchtowerV9?.battleSnapshot()?.unitCount===4);
 expect((await page.evaluate(()=>window.__watchtowerV9.battleSnapshot())).formationCount).toBe(4);

 await page.evaluate(()=>window.__watchtower.smokeFormation(1));
 await page.waitForFunction(()=>window.__watchtowerV9?.battleSnapshot()?.enemies.length>0);
 const before=await page.evaluate(()=>window.__watchtowerV9.battleSnapshot());
 const enemy=before.enemies[0];
 expect(enemy.screenY).toBeLessThan(.55);
 await page.waitForTimeout(500);
 const after=await page.evaluate(id=>window.__watchtowerV9.battleSnapshot().enemies.find(x=>x.id===id),enemy.id);
 expect(after).toBeTruthy();
 expect(after.worldZ).toBeGreaterThan(enemy.worldZ);
 expect(after.screenY).toBeGreaterThan(enemy.screenY);

 await page.evaluate(()=>window.__watchtower.smokeFormation(7));
 await page.setViewportSize({width:320,height:700});
 await page.waitForFunction(()=>window.__watchtowerV9?.battleSnapshot()?.unitCount===7);
 const compact=await page.evaluate(()=>({
   fits:document.documentElement.scrollWidth<=innerWidth,
   cards:[...document.querySelectorAll('.unit-card')].every(card=>{const r=card.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth})
 }));
 expect(compact.fits).toBeTruthy();
 expect(compact.cards).toBeTruthy();
 await page.screenshot({path:'test-results/v9-mobile-320-seven-defenders.png',fullPage:true});
});
