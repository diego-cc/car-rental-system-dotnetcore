/**
 * AppContext.js
 */
import React from 'react';

/**
 * AppContext - creates a "global" state for the app
 * @type {React.Context<{}>}
 */
export const AppContext = React.createContext({});

/**
 * AppProvider - provides the context for child components to consume
 * @type {React.Provider<{}>}
 */
export const AppProvider = AppContext.Provider;

/**
 * AppConsumer - allows child components to consume the context
 * @type {React.Consumer<{}>}
 */
export const AppConsumer = AppContext.Consumer;
