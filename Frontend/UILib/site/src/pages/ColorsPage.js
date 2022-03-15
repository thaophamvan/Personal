import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../lib/components/button/button';
import { Row, Column } from '../Layout';

const Palette = ({ label, varName, hex }) => (
  <div className="colors-page__palette">
    <div className={`colors-page__palette__display colors-page__palette__display--${varName}`} />
    <div className="colors-page__palette__data">
      <p className="colors-page__palette__title">{label}</p>
      <p className="colors-page__palette__code">#{hex.toUpperCase()}</p>
      <p className="colors-page__palette__code">$c-{varName}</p>
    </div>
  </div>
);

Palette.propTypes = {
  label: PropTypes.string.isRequired,
  varName: PropTypes.string.isRequired,
  hex: PropTypes.string.isRequired,
};

export default () => (
  <div>
    <h1>Colors</h1>

    <Row>
      <Column>
        <Button icon="download" href="assets/klara.sketchpalette">Sketch Palette</Button>
        <p>Import this palette using the <a href="https://github.com/andrewfiorillo/sketch-palettes">Color Palette Plugin</a>.</p>
      </Column>
    </Row>

    <Row>
      <Column>
        <h2>White</h2>
        <Palette label="White" varName="white-base" hex="ffffff" />
        <Palette label="Off White" varName="white-darker" hex="fafafa" />
      </Column>
    </Row>

    <Row>
      <Column>
        <h2>Gray</h2>
        <Palette label="Lightest Gray" varName="gray-lightest" hex="f7f8f9" />
        <Palette label="Lighter Gray" varName="gray-lighter" hex="eef1f2" />
        <Palette label="Light Gray" varName="gray-light" hex="d3dbdf" />
        <Palette label="Gray" varName="gray-base" hex="99abb3" />
        <Palette label="Dark Gray" varName="gray-dark" hex="617983" />
        <Palette label="Darker Gray" varName="gray-darker" hex="415158" />
        <Palette label="Darkest Gray" varName="gray-darkest" hex="20292b" />
      </Column>
    </Row>

    <Row>
      <Column>
        <h2>Brand</h2>
        <Palette label="Lightest Brand" varName="brand-lightest" hex="f8e3fd" />
        <Palette label="Light Brand" varName="brand-light" hex="a329a3" />
        <Palette label="Brand" varName="brand-base" hex="8c238c" />
      </Column>
    </Row>

    <Row>
      <Column>
        <h2>Active</h2>
        <Palette label="Lightest Active" varName="active-lightest" hex="e0fcff" />
        <Palette label="Light Active" varName="active-base" hex="00c9e0" />
        <Palette label="Active" varName="active-base" hex="0394a5" />
      </Column>
    </Row>

    <Row>
      <Column>
        <h2>Success</h2>
        <Palette label="Lightest Success" varName="success-lightest" hex="d3f0e1" />
        <Palette label="Success" varName="success-base" hex="21b468" />
      </Column>
    </Row>

    <Row>
      <Column>
        <h2>Warning</h2>
        <Palette label="Lightest Warning" varName="warning-lightest" hex="ffefd6" />
        <Palette label="Warning" varName="warning-base" hex="ff9d00" />
      </Column>
    </Row>

    <Row>
      <Column>
        <Column>
          <h2>Danger</h2>
          <Palette label="Lightest Danger" varName="danger-lightest" hex="f8d3cc" />
          <Palette label="Danger" varName="danger-base" hex="da2300" />
        </Column>
      </Column>
    </Row>

    <Row>
      <Column>
        <h2>Attention</h2>
        <Palette label="Attention" varName="attention-base" hex="ff4b1a" />
      </Column>
    </Row>

    <Row>
      <Column>
        <h2>Link</h2>
        <Palette label="Light Link" varName="link-light" hex="0087e3" />
        <Palette label="Link" varName="link-base" hex="0075c3" />
      </Column>
    </Row>

  </div>);
