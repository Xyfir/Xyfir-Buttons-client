import React from 'react';

// react-md
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';

// Components
import Pagination from 'components/misc/Pagination';

export default class FindPresets extends React.Component {

  constructor(props) {
    super(props);

    let searchType = 'name', searchQuery = '';

    this.state = {
      presets: [], tab: 0, order: 'downloads', direction: 'desc',
      lastId: (this.props.location.query.lastId || 0),
      searchType, searchQuery
    };

    this._renderInstalled = this._renderInstalled.bind(this);
    this._renderRemote = this._renderRemote.bind(this);
    this._loadPresets = this._loadPresets.bind(this);
    this._renderList = this._renderList.bind(this);
  }

  componentDidMount() {
    this._loadPresets(false);
  }

  /**
   * Make sure the query string's lastId variable matches this.state.lastId.
   */
  componentWillReceiveProps(props) {
    if (this.state.lastId != props.location.query.lastId) {
      this.setState({
        lastId: (props.location.query.lastId || 0)
      }, () => this._loadPresets(false));
    }
  }

  /**
   * Updates this.state.tab and calls this._loadPresets().
   * @param {number} tab - Index of the active tab. 0 == installed, 1 == remote
   */
  onChangeTab(tab) {
    this.setState({ tab }, () => this._loadPresets(false));
  }

  /**
   * Updates this.state and calls this._loadPresets().
   * @param {string} prop - The property name within this.state to set val to.
   * @param {any} val - The value to set to this.state at prop.
   */
  onFilter(prop, val) {
    this.setState({ [prop]: val }, () => this._loadPresets());
  }

  /**
   * Loads matching presets.
   * @param {boolean} [timeout=true] - If true, everything is wrapped in a 200
   * millisecond timeout that is cleared if _loadPresets() is called again
   * before the timeout is finished.
   */
  _loadPresets(timeout = true) {
    clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
      const presets = [];
      
      Object.entries(this.props.storage).map(s => {
        if (s[0].indexOf('preset_') == 0) presets.push(s[1]);
      });

      this.setState({ presets });
    }, timeout ? 200 : 0);
  }

  /**
   * Renders the actual list of presets.
   * @returns {JSX.Element}
   */
  _renderList() {
    if (!this.state.presets.length) {
      return (
        <List className='presets-list'>
          <ListItem primaryText='No presets found'  />
        </List>
      );
    }

    return (
      <List className='presets-list'>{
        this.state.presets.map(preset =>
          <a href={'#/presets/' + preset.id} key={preset.id}>
            <ListItem
              threeLines
              primaryText={preset.name}
              secondaryText={
                (
                  preset.domains == '*'
                    ? 'Global' : preset.domains == '**'
                    ? 'Multiple' : preset.domains
                )
                + '\n' + preset.description.split('\n')[0]
              }
            />
          </a>
        )
      }</List>
    );
  }

  /**
   * Renders the list of resources for finding presets.
   * @returns {JSX.Element}
   */
  _renderRemote() {
    if (this.state.tab != 1) return <div />;

    return (
      <List className='find-presets remote md-paper md-paper--1'>
        <ListItem
          primaryText='GitHub'
          onClick={() => location.href =
            'https://github.com/search?q=xybuttons&type=Repositories'
          }
        />
        <ListItem
          primaryText='GitHub Gist'
          onClick={() => location.href =
            'https://gist.github.com/search?q=xybuttons&ref=simplesearch'
          }
        />
        <ListItem
          primaryText='GreasyFork'
          onClick={() => location.href =
            'https://greasyfork.org/en/scripts?q=xybuttons'
          }
        />
        <ListItem
          primaryText='OpenUserJS'
          onClick={() => location.href =
            'https://openuserjs.org/?q=xybuttons'
          }
        />
      </List>
    );
  }

  /**
   * Renders all installed presets that match search query.
   * @returns {JSX.Element}
   */
  _renderInstalled() {
    if (this.state.tab != 0 || !this.state.presets) return <div />;

    return (
      <div className='find-presets installed'>
        <div className='controls'>
          <div className='md-grid'>
            <TextField
              fullWidth
              id='search--installed'
              type='search'
              label='Search'
              className='md-cell'
              onChange={v => this.onFilter('searchQuery', v)}
            />
          </div>
        </div>

        {this._renderList()}
      </div>
    );
  }

  render() {
    return (
      <TabsContainer
        colored
        onTabChange={tab => this.onChangeTab(tab)}
        panelClassName='md-grid'
        activeTabIndex={this.state.tab}
      >
        <Tabs tabId='tab' className='tabs'>
          <Tab label='Installed'>{this._renderInstalled()}</Tab>
          <Tab label='Remote'>{this._renderRemote()}</Tab>
        </Tabs>
      </TabsContainer>
    );
  }

}