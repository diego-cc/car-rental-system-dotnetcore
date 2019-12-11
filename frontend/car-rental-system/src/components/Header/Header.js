/**
 * Header.js
 */
import React from 'react';

/**
 * @typedef {Object} HeaderProps
 * @property {string} headerText - the title of this header
 */
/**
 * Header component
 * @param {HeaderProps} props
 * @returns {*}
 * @constructor
 */
export const Header = props => (
  <h1 className="display-5 text-center my-4">{props.headerText}</h1>
);
