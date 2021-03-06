import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// Components
import App from 'components/App';
import ViewButton from 'components/buttons/View';
import EditButton from 'components/buttons/Edit';
import EditPreset from 'components/presets/Edit';
import ForkButton from 'components/buttons/Fork';
import ViewPreset from 'components/presets/View';
import ForkPreset from 'components/presets/Fork';
import FindButtons from 'components/buttons/Find';
import FindPresets from 'components/presets/Find';
import CreateButton from 'components/buttons/Create';
import CreatePreset from 'components/presets/Create';
import DeleteButton from 'components/buttons/Delete';
import DeletePreset from 'components/presets/Delete';
import AddPresetButton from 'components/presets/buttons/Add';
import EditPresetButton from 'components/presets/buttons/Edit';
import ViewPresetButtons from 'components/presets/buttons/View';
import PlacePresetButtons from 'components/presets/buttons/Place';
import CreateButtonFromUserscript from 'components/buttons/CreateFromUserscript';

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={FindButtons} />

      <Route path="buttons">
        <IndexRoute component={FindButtons} />

        <Route path="create">
          <IndexRoute component={CreateButton} />

          <Route
            path="from-userscript"
            component={CreateButtonFromUserscript}
          />
        </Route>

        <Route path=":button">
          <IndexRoute component={ViewButton} />

          <Route path="edit" component={EditButton} />
          <Route path="fork" component={ForkButton} />
          <Route path="delete" component={DeleteButton} />
        </Route>
      </Route>

      <Route path="presets">
        <IndexRoute component={FindPresets} />

        <Route path="create" component={CreatePreset} />

        <Route path=":preset">
          <IndexRoute component={ViewPreset} />

          <Route path="edit" component={EditPreset} />
          <Route path="fork" component={ForkPreset} />
          <Route path="delete" component={DeletePreset} />

          <Route path="buttons">
            <IndexRoute component={ViewPresetButtons} />

            <Route path="add" component={AddPresetButton} />
            <Route path="place" component={PlacePresetButtons} />
            <Route path=":button" component={EditPresetButton} />
          </Route>
        </Route>
      </Route>
    </Route>
  </Router>,
  document.getElementById('app')
);
