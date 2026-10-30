# OLED77C1PUB field log

Field log for an LG OLED77C1PUB on webOS 6.5.3-47, software 03.53.45. [SlopBro](https://github.com/throwaway96/slopbro) v0.1.0 installed Homebrew Channel 0.7.3. Promo shelves, ad programs, and telemetry uploaders were then turned off. Firmware packages stayed on disk.

The page is [`index.html`](index.html), one file. The log sits on a full-screen Three.js quad (r170, MIT, loaded from a CDN) with a custom fragment shader. GitHub renders this README. The scene is on the [Pages site](https://thiagopanda.github.io/lg-oled77c1pub-field-notes/).

No passphrases, keys, serial numbers, ZIP codes, or network addresses are in this repository.

29 Oct 2026. Local set, owner present.

`Linux LGwebOSTV 4.4.84-229.kcl4tv.6 #1 SMP PREEMPT Sat Sep 13 08:10:48 UTC 2025 aarch64`

## Identity

| | |
|---|---|
| model | OLED77C1PUB · US · 2021 |
| platform | HE_DTV_W21O_AFABATAA |
| software | 03.53.45 |
| webOS | 6.5.3-47 |
| kernel | 4.4.84-229.kcl4tv.6 · aarch64 · built 13 Sep 2025 |

UPnP also answered as WebOS/1.5, 4.0.0, and 4.1.0. Those are service versions, not the OS. The friendly name was `[LG] webOS TV OLED77C1PUB`.

## What answered

Developer Mode 1.12.2 was on. Port 9922 was OpenSSH 6.1. The key server on 9991 was serving the developer key. Ports 3000, 3001, and 9998 were open. Root SSH on 22 and telnet on 23 were refused, so Homebrew’s root shell was not listening yet. The developer passphrase was not used, and a `prisoner` shell was not opened.

## Which root

This is not the webOS 3.9 case. DejaVuln had already been reported as failed on this exact software and webOS pair. [CanI.RootMy.TV](https://cani.rootmy.tv/) lists 03.53.45 as the last build vulnerable to SlopBro.

| method | on 03.53.45 |
|---|---|
| RootMy.TV | Closed. Last known-good C1 report in the tracker was 03.25.25. Later C1 firmware hung or rebooted with no Homebrew Channel. |
| crashd | Closed. W21O is listed patched from 03.40.85, and the current Developer Mode app closes the jail path. |
| faultmanager | Closed on current webOS 6. The Homebrew rooting page still said “no patches” as of January 2025. The tool readme, 24 Aug 2025, says latest webOS 6 firmware is patched. |
| DejaVuln | Closed here. [caniroot #100](https://github.com/webosbrew/caniroot/issues/100). |
| WTA, GetMeIn, NVM | Wrong generation, already patched, or the high-voltage hardware path. |
| SlopBro v0.1.0 | Used. European C1 sets on this exact software and webOS version were already confirmed. |

A failed software root is described as leaving the set alone. Bricks in the public notes come from writing a signed partition or marking files immutable. No permanent C1 brick from a failed root attempt turned up in this pass. [RootMy.TV’s warning](https://rootmy.tv/warning).

The open US failure is [SlopBro #7](https://github.com/throwaway96/slopbro/issues/7): an OLED77G1PUA on the same platform, software, and webOS version, using v0.0.5. The apps launched and never fetched the page. v0.0.5 is still marked Latest. v0.1.0 (`21023d56`, 27 Sep 2026) is the pre-release that adds the patch workaround. That was the reason to run v0.1.0. It was not a claim the G1 would do the same.

## Run

Flags: `--debug`, `--webos-version 6`, explicit LAN address, default fake-service-path workaround left enabled. Developer Mode SSH was not used. The on-screen Allow was accepted.

`com.webos.app.adoverlayex` was the first installed webOS 6 candidate. The TV fetched `index.html`, `autoroot.sh`, `package.json`, and `main.js` about a second later. `tinybrowser` was absent. `dangbei-overlay` was present with `standAloneLaunchable: false`. Those flags match the G1 report.

Homebrew Channel 0.7.3 appeared while Developer Mode 1.12.2 was still installed. No crash toast. Telnet on 23 then returned `uid=0(root)`. Port 22 was still refused. Developer Mode was removed afterward and was not installed again. `/var/luna/preferences/devmode_enabled` remained.

The comparison, without addresses or the client key, is [this comment on issue 7](https://github.com/throwaway96/slopbro/issues/7#issuecomment-6513916567).

## Ads and telemetry

[lg-webos-ad-killer](https://github.com/nurikk/lg-webos-ad-killer), hash `b7955ed3ac075dff56ce0b620097b0c59b41fbc2f2034e13e3480376de4de75b`. The author had run it on an OLED55C16LA at webOS 6.5.3. It bind-mounts a filtered home layout and exit stubs. It does not delete packages. Profile `ads` was used. Profile `privacy` would also stop voice, Alexa, ThinQ, and music recognition. Those were left running.

A copy of the settings files was saved at `/home/root/debloat-backup` first. The boot hook is `/var/lib/webosbrew/init.d/ad-killer`.

Home rows removed from the layout only: Prime, browser, content preview, editor’s picks, games, inline ad banner, both LG recommendation rows, Life on Screen, the Live TV row, recommended, sports alerts. The script aborts if the Apps row or the home dashboard row would be removed. This run finished. Live TV the app was not deleted.

Stubbed, and not running afterward: `acr2`, `admanager`, `nudge`, `rdxd`, `sportsalarm`, `uploadd`.

| setting | after |
|---|---|
| live promotion, LG Channels, watch history, promo video, demo mode | off |
| debug-log upload, fault-log upload | off · debug upload had been on |
| ad cookie, sports alarm, screensaver ad | off |
| limit ad tracking | on |
| home promotion, home auto-launch, customized ads, personal recommendations | already off |
| do not sell my personal information | already on |

Firmware-update hosts were not blocked. The Content Store and streaming apps still talk to their own services.

## OmarchyTV

`com.omarchytv.home` 2.13.1 was already installed. The in-app banner still says 2.13.0-beta. Number 8 was already a quick-access slot. [Install notes](https://github.com/piermark/omarchytv/blob/main/webos/INSTALL-WEBOS.md).

On a rooted set, Workspace 5 → All OmarchyTV settings:

- **Open when the TV starts** wrote `/var/lib/omarchytv/boot` and `/var/lib/webosbrew/init.d/omarchytv`.
- **Home button opens OmarchyTV** is a separate flag. Home from inside the app still reaches LG Home.
- **Keep loaded in the background** adds the app id to `KeepAlive` in `/home/root/memorymanager-conf.json` and restarts `memchute`.

That third switch showed “rooted TV only” even though the boot hook was already installed, so Homebrew exec was working. The probe’s last step reads the override file. The file does not exist until the switch has been on, `cat` exits 1, and the app treats any failed Homebrew command as “not rooted.”

`memchute` does contain the override path. The stock KeepAlive list was `com.webos.app.livehbbtv`, `com.webos.app.livedmost`, `com.webos.app.liveibb`. The override was written as that file plus `com.omarchytv.home`, memchute was restarted, and the probe was changed so a missing override is not a failed command.

## Left in place

| | |
|---|---|
| firmware packages | kept |
| voice, Alexa, ThinQ, music recognition | still running |
| firmware update checks | not blocked |
| Developer Mode | removed · do not install it again while rooted |
| root SSH | was still refused when telnet was checked |
| locale, alerts, country | not rewritten |

## Sources

| | |
|---|---|
| SlopBro | [repo](https://github.com/throwaway96/slopbro) · v0.1.0 · `21023d56` |
| same firmware, European C1s | [issue 1](https://github.com/throwaway96/slopbro/issues/1) |
| same firmware, US G1 miss | [issue 7](https://github.com/throwaway96/slopbro/issues/7) |
| this set’s comparison | [comment](https://github.com/throwaway96/slopbro/issues/7#issuecomment-6513916567) |
| DejaVuln on 03.53.45 | [caniroot #100](https://github.com/webosbrew/caniroot/issues/100) |
| per-firmware check | [CanI.RootMy.TV](https://cani.rootmy.tv/) |
| faultmanager | [repo](https://github.com/throwaway96/faultmanager-autoroot) |
| exploit list | [webOS Homebrew](https://www.webosbrew.org/rooting/exploits/) |
| crashd / W21O 03.40.85 | [gist](https://gist.github.com/throwaway96/e811b0f7cc2a705a5a476a8dfa45e09f) |
| signed partitions | [warning](https://rootmy.tv/warning) |
| ad killer | [repo](https://github.com/nurikk/lg-webos-ad-killer) |
| OmarchyTV on webOS | [install](https://github.com/piermark/omarchytv/blob/main/webos/INSTALL-WEBOS.md) |
| Homebrew Channel | [repo](https://github.com/webosbrew/webos-homebrew-channel) · 0.7.3 |
