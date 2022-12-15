/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-02 14:36:19
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-15 11:20:36
 * @Description: file description
 */
import './style.css';

export default function Loading() {
  return (
    <div className="rubiks-loader">
      <div className="cube">
        {/* <!-- base position --> */}
        <div className="face front piece row-top    col-left   yellow" />
        <div className="face front piece row-top    col-center green " />
        <div className="face front piece row-top    col-right  white " />
        <div className="face front piece row-center col-left   blue  " />
        <div className="face front piece row-center col-center green " />
        <div className="face front piece row-center col-right  blue  " />
        <div className="face front piece row-bottom col-left   green " />
        <div className="face front piece row-bottom col-center yellow" />
        <div className="face front piece row-bottom col-right  red   " />

        {/* <!-- first step: E', equator inverted --> */}
        <div className="face down  piece row-top    col-center green " />
        <div className="face down  piece row-center col-center red   " />
        <div className="face down  piece row-bottom col-center white " />

        {/* <!-- second step: M, middle --> */}
        <div className="face right piece row-center col-left   yellow" />
        <div className="face right piece row-center col-center green " />
        <div className="face right piece row-center col-right  blue  " />

        {/* <!-- third step: L, left --> */}
        <div className="face up    piece row-top    col-left   yellow" />
        <div className="face up    piece row-center col-left   blue  " />
        <div className="face up    piece row-bottom col-left   green " />

        {/* <!-- fourth step: D, down --> */}
        <div className="face left  piece row-bottom col-left   green " />
        <div className="face left  piece row-bottom col-center yellow" />
        <div className="face left  piece row-bottom col-right  red   " />
      </div>
    </div>
  );
}
