import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import IconButton from 'mastodon/components/icon_button';
import Icon from 'mastodon/components/icon';
import AutosuggestInput from 'mastodon/components/autosuggest_input';
import classNames from 'classnames';

const messages = defineMessages({
  option_placeholder: { id: 'compose_form.poll.option_placeholder', defaultMessage: 'Choice {number}' },
  add_option: { id: 'compose_form.poll.add_option', defaultMessage: 'Add a choice' },
  remove_option: { id: 'compose_form.poll.remove_option', defaultMessage: 'Remove this choice' },
  poll_duration: { id: 'compose_form.poll.duration', defaultMessage: 'Poll duration' },
  minutes: { id: 'intervals.full.minutes', defaultMessage: '{number, plural, one {# minute} other {# minutes}}' },
  hours: { id: 'intervals.full.hours', defaultMessage: '{number, plural, one {# hour} other {# hours}}' },
  days: { id: 'intervals.full.days', defaultMessage: '{number, plural, one {# day} other {# days}}' },
});

@injectIntl
class Option extends React.PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    isPollMultiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onToggleMultiple: PropTypes.func.isRequired,
    suggestions: ImmutablePropTypes.list,
    onClearSuggestions: PropTypes.func.isRequired,
    onFetchSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleOptionTitleChange = e => {
    this.props.onChange(this.props.index, e.target.value);
  };

  handleOptionRemove = () => {
    this.props.onRemove(this.props.index);
  };


  handleToggleMultiple = e => {
    this.props.onToggleMultiple();
    e.preventDefault();
    e.stopPropagation();
  };

  onSuggestionsClearRequested = () => {
    this.props.onClearSuggestions();
  }

  onSuggestionsFetchRequested = (token) => {
    this.props.onFetchSuggestions(token);
  }

  onSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['poll', 'options', this.props.index]);
  }

  render () {
    const { isPollMultiple, title, index, intl } = this.props;

    return (
      <li>
        <label className='poll__text editable'>
          <span
            className={classNames('poll__input', { checkbox: isPollMultiple })}
            onClick={this.handleToggleMultiple}
            role='button'
            tabIndex='0'
          />

          <AutosuggestInput
            placeholder={intl.formatMessage(messages.option_placeholder, { number: index + 1 })}
            maxLength={200}
            value={title}
            onChange={this.handleOptionTitleChange}
            suggestions={this.props.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            searchTokens={[':']}
          />
        </label>

        <div className='poll__cancel'>
          <IconButton disabled={index <= 1} title={intl.formatMessage(messages.remove_option)} icon='times' onClick={this.handleOptionRemove} />
        </div>
      </li>
    );
  }

}

export default
@injectIntl
class PollForm extends ImmutablePureComponent {

  static propTypes = {
    options: ImmutablePropTypes.list,
    expiresIn: PropTypes.number,
    isMultiple: PropTypes.bool,
    onChangeOption: PropTypes.func.isRequired,
    onAddOption: PropTypes.func.isRequired,
    onRemoveOption: PropTypes.func.isRequired,
    onChangeSettings: PropTypes.func.isRequired,
    suggestions: ImmutablePropTypes.list,
    onClearSuggestions: PropTypes.func.isRequired,
    onFetchSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleAddOption = () => {
    this.props.onAddOption('');
  };

  handleSelectDuration = e => {
    this.props.onChangeSettings(e.target.value, this.props.isMultiple);
  };

  handleToggleMultiple = () => {
    this.props.onChangeSettings(this.props.expiresIn, !this.props.isMultiple);
  };

  render () {
    const { options, expiresIn, isMultiple, onChangeOption, onRemoveOption, intl, ...other } = this.props;

    if (!options) {
      return null;
    }

    return (
      <div className='compose-form__poll-wrapper'>
        <ul>
          {options.map((title, i) => <Option title={title} key={i} index={i} onChange={onChangeOption} onRemove={onRemoveOption} isPollMultiple={isMultiple} onToggleMultiple={this.handleToggleMultiple} {...other} />)}
        </ul>

        <div className='poll__footer'>
          {options.size < 20 && (
            <button className='button button-secondary' onClick={this.handleAddOption}><Icon id='plus' /> <FormattedMessage {...messages.add_option} /></button>
          )}

          <select value={expiresIn} onChange={this.handleSelectDuration}>
            <option value={60}>{intl.formatMessage(messages.minutes, { number: 1 })}</option>
            <option value={120}>{intl.formatMessage(messages.minutes, { number: 2 })}</option>
            <option value={180}>{intl.formatMessage(messages.minutes, { number: 3 })}</option>
            <option value={240}>{intl.formatMessage(messages.minutes, { number: 4 })}</option>
            <option value={300}>{intl.formatMessage(messages.minutes, { number: 5 })}</option>
            <option value={600}>{intl.formatMessage(messages.minutes, { number: 10 })}</option>
            <option value={900}>{intl.formatMessage(messages.minutes, { number: 15 })}</option>
            <option value={1200}>{intl.formatMessage(messages.minutes, { number: 20 })}</option>
            <option value={1800}>{intl.formatMessage(messages.minutes, { number: 30 })}</option>
            <option value={2700}>{intl.formatMessage(messages.minutes, { number: 45 })}</option>
            <option value={3600}>{intl.formatMessage(messages.hours, { number: 1 })}</option>
            <option value={7200}>{intl.formatMessage(messages.hours, { number: 2 })}</option>
            <option value={10800}>{intl.formatMessage(messages.hours, { number: 3 })}</option>
            <option value={21600}>{intl.formatMessage(messages.hours, { number: 6 })}</option>
            <option value={32400}>{intl.formatMessage(messages.hours, { number: 9 })}</option>
            <option value={43200}>{intl.formatMessage(messages.hours, { number: 12 })}</option>
            <option value={64800}>{intl.formatMessage(messages.hours, { number: 18 })}</option>
            <option value={86400}>{intl.formatMessage(messages.days, { number: 1 })}</option>
            <option value={172800}>{intl.formatMessage(messages.days, { number: 2 })}</option>
            <option value={259200}>{intl.formatMessage(messages.days, { number: 3 })}</option>
            <option value={345600}>{intl.formatMessage(messages.days, { number: 4 })}</option>
            <option value={432000}>{intl.formatMessage(messages.days, { number: 5 })}</option>
            <option value={518400}>{intl.formatMessage(messages.days, { number: 6 })}</option>
            <option value={604800}>{intl.formatMessage(messages.days, { number: 7 })}</option>
            <option value={864000}>{intl.formatMessage(messages.days, { number: 10 })}</option>
            <option value={1209600}>{intl.formatMessage(messages.days, { number: 14 })}</option>
            <option value={1296000}>{intl.formatMessage(messages.days, { number: 15 })}</option>
            <option value={1728000}>{intl.formatMessage(messages.days, { number: 20 })}</option>
            <option value={1814400}>{intl.formatMessage(messages.days, { number: 21 })}</option>
            <option value={2419200}>{intl.formatMessage(messages.days, { number: 28 })}</option>
            <option value={2592000}>{intl.formatMessage(messages.days, { number: 30 })}</option>
          </select>
        </div>
      </div>
    );
  }

}
