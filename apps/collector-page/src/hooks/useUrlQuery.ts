/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 18:18:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-15 18:23:58
 * @Description: file description
 */
import React from 'react'
import { useLocation } from 'react-router-dom'

function useUrlQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}
export default useUrlQuery
