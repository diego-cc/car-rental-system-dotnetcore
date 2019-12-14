/**
 * SearchVehicle.js
 */
import React, {useEffect, useRef, useState} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import {AppConsumer} from "../../AppContext/AppContext";
import {Button, Form, FormGroup} from "react-bootstrap";
import {useHistory} from 'react-router-dom';

/**
 * SearchVehicle component - allows the user to search for a vehicle (with typeahead) by
 * manufacturer, model or year
 * @returns {*}
 * @constructor
 */
export const SearchVehicle = () => {
  const [selected, setSelected] = useState([]);
  const typeaheadRef = useRef(null);
  const history = useHistory();

  const handleSubmit = e => {
    e.preventDefault();

    if (selected && selected.length) {
      history.push(`/show/${selected[0].uuid}`);
    }
  };

  useEffect(() => {
    if (selected.length) {
      history.push(`/show/${selected[0].uuid}`);
    }
  }, [selected, typeaheadRef, history]);

  return (
    <AppConsumer>
      {
        ({vehicles}) => (
          <Form inline onSubmit={handleSubmit} className="mr-md-3">
            <FormGroup>
              <Typeahead
                id="search-vehicle"
                labelKey={(option) => `${option.manufacturer} ${option.model} (${option.year})`}
                filterBy={['manufacturer', 'model', 'year']}
                options={vehicles}
                placeholder="Search for a vehicle..."
                highlightOnlyResult
                minLength={1}
                onChange={selected => setSelected(selected)}
                ref={typeaheadRef}
                selectHintOnEnter={true}
                submitFormOnEnter={selected[0]}
              />
              <Button variant="outline-primary" type="submit" className="ml-sm-3">
                Search
              </Button>
              <Button
                onClick={() => {
                  typeaheadRef.current.clear();
                  typeaheadRef.current.focus();
                  history.push(`/browse`);
                }}
                variant="outline-danger"
                className="ml-sm-3">
                Clear
              </Button>
            </FormGroup>
          </Form>
        )
      }
    </AppConsumer>
  )
};
