import React from 'react';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import Button from 'react-md/lib/Buttons/Button';

// Components
import ScriptEditor from 'components/editors/Script';
import StylesEditor from 'components/editors/Styles';

class ButtonForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scriptSource: this.props.button.name
        ? this.props.button.repository
          ? 'Remote' : 'Local'
        : 'Remote'
    };
  }

  /**
   * Validate the provided data. If data is valid call this.props.onSuccess().
   * @param {Event} [e]
   */
  onValidate(e) {
    e && e.preventDefault();
    
    const data = {
      name: this.refs.name._field.getValue(),
      styles: this.refs.stylesEditor.value,
      script: (
        this.state.scriptSource == 'Local'
          ? this.refs.scriptEditor.value : ''
      ),
      tooltip: this.refs.tooltip._field.getValue(),
      domains: this.refs.domains._field.getValue(),
      content: encodeURIComponent(this.refs.content._field.getValue()),
      urlMatch: this.refs.urlMatch._field.getValue(),
      isListed: document.getElementById('cb--is-listed').checked,
      repository: (
        this.state.scriptSource == 'Remote'
          ? this.refs.repository._field.getValue() : ''
      ),
      description: this.refs.description._field.getValue()
    };

    const button = Object.assign({}, data);

    // Validate data
    try {
      if (!button.name)
        throw 'Button must have a name';
      if (button.name.length > 50)
        throw 'Button name limited to 50 characters';
      if (!button.urlMatch)
        throw 'URL match does not exist';
      if (button.urlMatch.length > 500)
        throw 'URL match value limited to 500 characters';
      if (!button.script && !button.repository)
        throw 'No script file or repository link provided';
      if (button.domains && button.length > 100)
        throw 'Domains list limited to 100 characters';
      
      if (button.script) {
        try {
          button.script = JSON.parse(button.script);
        }
        catch (e) {
          throw 'Invalid button script';
        }

        if (!button.script['main.js'])
          throw 'Button script must have a non-empty main.js file';
      }

      if (button.tooltip && button.tooltip.length > 255)
        throw 'Tooltip cannot be longer than 255 characters';
    }
    catch (e) {
      this.props.App._alert(e);
    }

    this.props.onSuccess(data);
  }

  render() {
    const b = this.props.button;

    return (
      <form onSubmit={(e) => this.onValidate(e)}>
        <h2>Required Data</h2>
        
        <TextField
          id='text--name'
          ref='name'
          type='text'
          label='Button Name'
          className='md-cell'
          defaultValue={b.name}
        />

        <TextField
          id='text--url-match'
          ref='urlMatch'
          type='text'
          label='URL Match Expression'
          helpText='Your button will only be injected if the url matches'
          className='md-cell'
          defaultValue={b.urlMatch}
        />

        <SelectField
          id='select--script-source'
          label='Script Source'
          value={this.state.scriptSource}
          menuItems={[
            'Remote', 'Local'
          ]}
          onChange={v => this.setState({ scriptSource: v })}
          className='md-cell'
        />

        {this.state.scriptSource == 'Remote' ? (
          <TextField
            id='text--repository'
            ref='repository'
            type='text'
            label='Repository'
            helpText='A GitHub gist repo to pull the button script from'
            className='md-cell'
            defaultValue={b.repository}
          />
        ) : (
          <ScriptEditor
            ref='scriptEditor'
            value={b.script}
            onError={this.props.App._alert}
          />
        )}
      
        <hr className='divider' />

        <h2>Optional Public Data</h2>

        <Checkbox
          id='cb--is-listed'
          name='cb--is-listed'
          label='List Publicly'
          defaultChecked={!!b.isListed}
        />

        <TextField
          id='textarea--description'
          ref='description'
          rows={10}
          type='text'
          label='Description'
          helpText='Let others know what your button does if its public'
          className='md-cell'
          defaultValue={b.description}
          lineDirection='right'
        />

        <TextField
          id='text--domains'
          ref='domains'
          type='text'
          label='Domains'
          helpText={
            'Domains that your button works on. Has no effect on button'
            + ' behavior. Use * for global or ** for too many sites to'
            + ' list.'
          }
          className='md-cell'
          defaultValue={b.domains}
        />
        
        <hr className='divider' />

        <h2>Optional Button Data</h2>

        <TextField
          id='text--tooltip'
          ref='tooltip'
          type='text'
          label='Tooltip'
          helpText={
            'Text that is shown when the user hovers over your button'
          }
          className='md-cell'
          defaultValue={b.tooltip}
        />

        <TextField
          id='text--content'
          ref='content'
          type='text'
          label='Button Content'
          helpText={
            'The text content of the button; all characters / emojis accepted'
          }
          className='md-cell'
          defaultValue={decodeURIComponent(b.content)}
        />

        <StylesEditor ref='stylesEditor' value={b.styles} />

        <hr className='divider' />

        <Button
          raised primary
          label='Submit'
          onClick={() => this.onValidate()}
        />
      </form>
    );
  }

}

ButtonForm.propTypes = {
  /**
   * Called when provided data is valid. Passes button data object.
   */
  onSuccess: React.PropTypes.func.isRequired,
  /**
   * Button object containing the properties of variables that xyButtons'
   * button creation or modification API controller will expect.
   */
  button: React.PropTypes.object
};

ButtonForm.defaultProps = {
  button: {
    name: '', urlMatch: '.*', script: '', repository: '', description: '',
    domains: '*', isListed: false, tooltip: '', content: '', styles: ''
  }
};

export default ButtonForm;