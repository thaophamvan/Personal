import React from 'react';

import { Row, Column } from '../Layout';

import PropsTable from '../PropsTable';
import ComponentDemo from '../ComponentDemo';
import ComponentPlayground from '../ComponentPlayground';

import Button from '../../../lib/components/button/button';
import TextField from '../../../lib/components/textField/textField';

export default class TextFields extends React.Component {
  constructor() {
    super();
    this.state = {
      playgroundField: 'It\'s playground here! \nTry it out.',
      counterTextFieldValue: '',
      counterFilledTextFieldValue: 'Please, no more characters!\nTwitter requirements...',
      demoFormName: 'Edmund',
      demoFormEmail: 'edmund.blunden@example.com',
      demoFormSurName: 'Blunden',
      demoFormStory: 'In Europe, the lyric emerged as the principal poetic form of the 19th century and came to be seen as synonymous with poetry.[19] Romantic lyric poetry consisted of first-person accounts of the thoughts and feelings of a specific moment; the feelings were extreme but personal.[20]',
      demoFormNameError: '',
      demoFormEmailError: '',
    };
  }

  setInputValue = (value) => {
    this.setState({ value });
  }

  getHandlers = field => ({
    value: this.state[field],
    onChange: val => this.setState({ [field]: val }),
  })

  demoFormReset = () =>
    this.setState({
      demoFormName: '',
      demoFormEmail: '',
      demoFormStory: '',
      demoFormSurName: '',
      demoFormNameError: '',
      demoFormEmailError: '',
    });

  demoFormValidate = () => {
    const { demoFormName, demoFormEmail } = this.state;
    const validationObj = { demoFormNameError: '', demoFormEmailError: '' };

    if (!demoFormName) {
      validationObj.demoFormNameError = 'Name is a required very-very REALLY important field ';
    }

    if (!demoFormEmail) {
      validationObj.demoFormEmailError = 'Email is a required field';
    } else if (demoFormEmail.indexOf('@') < 0) {
      validationObj.demoFormEmailError = 'You should use "@", so it will at least look like an email';
    }

    this.setState(validationObj);
  }

  render() {
    const {
      demoFormNameError,
      demoFormEmailError,
    } = this.state;

    return (
      <div>
        <h1>Text Field</h1>

        <Row>
          <Column>
            <ComponentDemo>
              <TextField
                label="Text Field with Counter"
                maxLength={15}
                helperText="Try to be as discrete as possible, we're watching you"
                {...this.getHandlers('counterTextFieldValue')}
              />
            </ComponentDemo>
          </Column>
          <Column>
            <ComponentDemo>
              <TextField
                label="Multi Line Text Field with Counter"
                multiLine
                maxLength={140}
                {...this.getHandlers('counterFilledTextFieldValue')}
              />
            </ComponentDemo>
          </Column>
        </Row>

        <Row>
          <Column>
            <ComponentPlayground excludedProps={['className']}>
              <TextField {...this.getHandlers('playgroundField')} />
            </ComponentPlayground>
          </Column>
        </Row>

        <h2>Demo form</h2>

        <Row>
          <Column>
            <div className="demo-text-field-form">
              <div className="demo-text-field-form__row">
                <TextField
                  label="Name"
                  markRequired
                  errorText={demoFormNameError}
                  {...this.getHandlers('demoFormName')}
                />
                <TextField
                  label="Surname"
                  maxLength={42}
                  {...this.getHandlers('demoFormSurName')}
                />
              </div>
              <div className="demo-text-field-form__row">
                <TextField
                  label="Email"
                  markRequired
                  helperText="We'll use it for good..."
                  errorText={demoFormEmailError}
                  {...this.getHandlers('demoFormEmail')}
                />
              </div>
              <div className="demo-text-field-form__row">
                <TextField
                  multiLine
                  maxLength={255}
                  placeholder="Tell us yor story..."
                  {...this.getHandlers('demoFormStory')}
                />
              </div>
              <div className="demo-text-field-form__controls">
                <Button onClick={this.demoFormReset}>Reset Form</Button>
                <Button primary onClick={this.demoFormValidate}>Validate</Button>
              </div>
            </div>
          </Column>
        </Row>

        <Row>
          <Column>
            <PropsTable component={TextField} />
          </Column>
        </Row>

      </div>
    );
  }
}
