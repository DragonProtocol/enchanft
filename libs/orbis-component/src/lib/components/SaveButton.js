import React, { useState, useEffect, useRef, useContext } from 'react';

/** Simple component to handle saving status */
export function SaveButton({status, className = "purple", title, image, onClick}) {
  switch (status) {
    /** Main active state */
    case 0:
      return <div className={"btn " + className} onClick={() => onClick()}>{title}</div>;

    /** Loading state */
    case 1:
      return <div className="btn transparent-dashed"><img src="/img/icons/loading-white.svg" height="15" /></div>;

    /** Success state */
    case 2:
      return <div className="btn green">Success</div>;

    /** Error sharing post */
    case 3:
      return <div className="btn red">Error!</div>;

    /** Default */
    default:
      return <div className={"btn " + className} onClick={() => handleClick()}>{title}</div>;
  }
}
