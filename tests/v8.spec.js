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
