import React from 'react';
/** Simple component for menu items */
export function MenuItemLevel2({title, image, imageActive, active, route , onClick, target = "_self"}) {
  if(route) {
    return(
        <div className={active ? "item active" : "item"}>
          {image && <img src={active ? imageActive : image} height="15" />}
          <p>
            {target == "_self" ?
              <a href={route} target={target}>{title}</a>
            :
              <a href={route} target={target}>{title}</a>
            }
          </p>
        </div>

    )
  } else if(onClick) {
    return(
      <div className={active ? "item active" : "item"} onClick={() => onClick()}>
        {image && <img src={active ? imageActive : image} height="15" />}
        <p>{title}</p>
      </div>
    )
  } else {
    return(
      <div className={active ? "item active" : "item"}>
        {image && <img src={active ? imageActive : image} height="15" />}
        <p>{title}</p>
      </div>
    )
  }
}