import React, { useState, useEffect, useRef, useContext } from 'react';

/** Modal component */
export function Modal({visible, setVisible, title, tabs, tabSelected = 0, setTabSelected, children}) {

  if(visible) {
    return (
      <>
        {/**  */}
        <div className="modal-background" onClick={() => setVisible(false)}>
        </div>

        <div className="modal">
          {/** Show title modal if passed as a parameter */}
          {title &&
            <div className="modal-head">
              <h2>{title}</h2>
            </div>
          }

          {/** Show navigation tabs if available */}
          {tabs && tabs.length > 0 &&
            <div className="modal-tabs">
              <Tabs tabs={tabs} tabSelected={tabSelected} setTabSelected={setTabSelected} />
            </div>
          }

          {/** Show children */}
          {children}
        </div>
      </>
    )
  } else {
    return null;
  }
}

/** Loop through all tabs and display their content */
function Tabs({tabs, tabSelected, setTabSelected}) {
  return tabs.map((tab, key) => {
    if(key == tabSelected) {
      return(
        <div className="modal-tab active">{tab}</div>
      )
    } else {
      return(
        <div className="modal-tab" onClick={setTabSelected ? () => setTabSelected(key) : console.log("You haven't added the function to select a new tab.")}>{tab}</div>
      )
    }

  });
}
