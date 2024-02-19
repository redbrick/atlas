---
layout: default.njk
sections:
  hero:
    title:
      secondary: DCU's Networking Society.
      primary: Become a Member.
    body: Redbrick was formed from a battered 386 PC (dubbed Nurse), bits of borrowed memory, and a group of friends working together. We’re open to everyone regardless of computing level and always looking for people who want to come and learn!
    buttons:
      primary:
        text: Signup 
        link: https://dcuclubsandsocs.ie/society/redbrick
      secondary:
        text: Discord
        link: https://discord.redbrick.dcu.ie
  committee:
    - name: James Hackett
      position: 🪑 Chair
      username: distro
      image: /assets/img/committee/distro.jpg
    - name: Shane Whelan
      position: 🪑 Vice-Chair
      username: pluto
      image: /assets/img/committee/pluto.jpg
    - name: Jake Farrell
      position: 💌 Secretary
      username: cheese
      image: /assets/img/committee/cheese.png
    - name: Malavika Shanker
      position: 💸 Treasurer
      username: calcifer
      image: /assets/img/committee/calcifer.png
    - name: Philip Leonard
      position: 📢 PRO
      username: payne
      image: /assets/img/committee/payne.png
    - name: Ishita Gupta
      position: 🎨 GDO
      username: ishitag
      image: /assets/img/committee/ishitag.jpg
    - name: Dominic Connor
      position: 🚀 SysAdmin
      username: wizzdom
      image: /assets/img/committee/wizzdom.png
    - name: Cathal O'Grady
      position: 🚀 SysAdmin
      username: cathalog
      image: /assets/img/committee/cathalog.jpg
    - name: Gavin Holahan
      position: 🍼 SysAdmin
      username: hypnoant
      image: /assets/img/committee/hypnoant.png
    - name: Jed Hazaymeh
      position: 👾 Webmaster
      username: magma
      image: /assets/img/committee/magma.png
    - name: Ayden Jahola
      position: 🙌 Helpdesk
      username: ayden
      image: /assets/img/committee/ayden.png
    - name: Francis Baxter
      position: 🙌 Helpdesk
      username: fbaxter
      image: /assets/img/committee/fbaxter.png
    - name: Robert Healy
      position: 📅 Events Officer
      username: orb
      image: /assets/img/committee/orb.png
    - name: Stefania Ogun
      position: 📅 Events Officer
      username: stefania
      image: /assets/img/committee/stefania.jpg
    - name: Callum Browne
      position: 💎 Ordinary Member
      username: browner
      image: /assets/img/committee/browner.png
    - name: Daniel McEntee
      position: 💎 Ordinary Member
      username: kronos
      image: /assets/img/committee/kronos.png
    - name: Dennis Custiuc
      position: 🥇 First Year Rep.
      username: swooshy
      image: /assets/img/committee/swooshy.png
  cta:
    title: Don't Miss Out
    body: Redbrick hosts events for everything tech related - from computer programming tutorials to workshops with multinational tech companies.
    button:
      text: Signup
      link: https://dcuclubsandsocs.ie/society/redbrick
---
<main>
  {% include "home/sections/hero.njk" %}
  {% include "home/sections/committee.njk" %}
  {% include "home/sections/cta.njk" %}
</main>