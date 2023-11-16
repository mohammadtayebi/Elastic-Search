import React, { useEffect } from "react";
import pic from "./assets/5566882.jpg";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import "./styles.css";
import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch,
  Result,
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields,
} from "./config/config-helper";

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new AppSearchAPIConnector({
  searchKey,
  engineName,
  hostIdentifier,
  endpointBase,
});
const config = {
  searchQuery: {
    facets: buildFacetConfigFromConfig(),
    ...buildSearchOptionsFromConfig(),
  },
  autocompleteQuery: buildAutocompleteQueryConfig(),
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
};
const checkThings = () => {
  // console.log(getConfig());
  // console.log(buildAutocompleteQueryConfig());
  // console.log(buildFacetConfigFromConfig());
  // console.log(buildSearchOptionsFromConfig());
  // console.log(buildSortOptionsFromConfig());
  // console.log(getFacetFields());
};
export default function App() {
  return (
    <div>
      <img src={pic} alt="" />
      <SearchProvider config={config}>
        <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
          {({ wasSearched }) => {
            return (
              <div className="App">
                <ErrorBoundary>
                  <Layout
                    header={
                      <SearchBox
                        autocompleteSuggestions={true}
                        searchAsYouType={true}
                        debounceLength={300}
                        inputProps={{ placeholder: "متن جست و جو" }}
                        view={({ value, onChange, onSubmit }) => (
                          <div className="bg-light py-5">
                            <form
                              onSubmit={onSubmit}
                              className="search-container w-75 d-flex justify-content-between  m-auto shadow ps-3 my-5 bg-white rounded"
                            >
                              <i
                                class="fa fa-search my-auto"
                                aria-hidden="true"
                              ></i>
                              <input
                                className="border-0 w-100"
                                type="text"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                              />
                              <input
                                type="submit"
                                value="Search"
                                className="button btn-primary rounded-end px-5"
                              />
                            </form>
                          </div>
                        )}
                      />
                    }
                    sideContent={
                      <div>
                        {getFacetFields().map((field) => (
                          // field === "category" ? (
                          //   <Facet key={field} field={field} label={field} />
                          // ) : null
                          <Facet key={field} field={field} label={field} />
                        ))}
                      </div>
                    }
                    bodyContent={
                      <Results
                        titleField={getConfig().titleField}
                        urlField={getConfig().urlField}
                        thumbnailField={getConfig().thumbnailField}
                        shouldTrackClickThrough={true}
                      />
                    }
                    bodyHeader={
                      <React.Fragment>
                        {wasSearched && <PagingInfo />}
                        {wasSearched && <ResultsPerPage />}
                      </React.Fragment>
                    }
                    bodyFooter={<Paging />}
                  />
                </ErrorBoundary>
              </div>
            );
          }}
        </WithSearch>
      </SearchProvider>
    </div>
  );
}
