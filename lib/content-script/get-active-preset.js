/**
 * Returns the active preset for the tab's current url.
 * @module lib/content-script/get-active-preset
 * @param {MessageEvent} event - A window.postMessage() event object.
 * @param {object} data - An alias for event.data;
 */
export default function(event, data) {
  const tabKey = 'tab_' + chrome.tabId;

  let match = {},
    matches = [];

  chrome.p.storage.local
    .get([tabKey, 'presets'])
    .then(res => {
      if (!Array.isArray(res.presets)) throw 'No presets stored';

      if (!res[tabKey]) res[tabKey] = { activePreset: -1, presetHidden: false };

      // If data.usePreset, the user is switching to a new preset
      // otherwise attempt to load the tab's active preset
      match = data.usePreset
        ? res.presets.find(p => p.id == data.usePreset)
        : res.presets.find(p => p.id == res[tabKey].activePreset);

      // Get id / urlMatch for all presets that match the current url
      matches = res.presets.filter(preset => {
        return RegExp(preset.urlMatch).test(location.href);
      });

      // If tab's active preset or data.usePreset doesn't exist or doesn't
      // match current url, get the first preset that matches the current url
      if (!match || !RegExp(match.urlMatch).test(location.href))
        match = matches[0];

      if (!match) throw 'No presets match';

      // Set new active preset
      if (data.usePreset == match.id) {
        chrome.storage.local.set({
          [tabKey]: { activePreset: match.id, presetHidden: false }
        });
      }

      match.hidden = res[tabKey].presetHidden;

      // Get full data for preset
      return chrome.p.storage.local.get('preset_' + match.id);
    })
    .then(res => {
      if (!res['preset_' + match.id]) throw 'Could not load preset';

      Object.assign(match, res['preset_' + match.id]);

      // Load buttons in preset
      return chrome.p.storage.local.get(
        match.buttons.map(b => 'button_' + b.id)
      );
    })
    .then(res => {
      // Convert object to array, discarding property names
      const buttons = Object.entries(res).map(b => b[1]);

      // Merge the objects in buttons[] and match.buttons[]
      match.buttons = match.buttons.map(b1 => {
        const b2 = buttons.find(b2 => b1.id == b2.id);

        // Preset creator styles override button creator styles which then
        // override xyButtons button styles
        (b2.styles = JSON.parse(b2.styles)),
          (b1.styles = JSON.parse(b1.styles));
        Object.assign(b2.styles, b1.styles);

        b1.styles = b2.styles;

        return Object.assign(b2, b1);
      });

      // Emit event for inject.js to catch
      window.postMessage(
        {
          from: 'content-script.js',
          transaction: data.transaction,
          preset: match,
          matches
        },
        location.href
      );
    })
    .catch(err => {
      console.log('xyB lib/content-script/get-active-preset:', err);
    });
}
