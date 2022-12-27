/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-27 14:14:00
 * @Description: file description
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  // DaylightListParams,
  // fetchListByDaylight,
  fetchListForEventExplore,
} from '../../services/api/event';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
// import { OrderBy } from '../../services/types/common';
import {
  EventExploreListItemResponse,
  EventExploreListParams,
} from '../../services/types/event';
import type { RootState } from '../../store/store';
// import {
//   daylightAbilityListToEventList,
//   getHideDaylightIdsByStorage,
// } from '../../utils/daylight';

export type EventExploreListItem = EventExploreListItemResponse & {
  isDaylight?: boolean;
};
type EventExploreListStore = EntityState<EventExploreListItem> & {
  status: AsyncRequestStatus;
  moreStatus: AsyncRequestStatus;
  noMore: boolean;
  pageNumber: number;
  errorMsg: string;
  moreErrorMsg: string;
  currentRequestId: string; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
  // daylightUid: string;
};
const PAGE_SIZE = 20;
const PAGE_NUMBER_FIRST = 0;
export const eventExploreListEntity = createEntityAdapter<EventExploreListItem>(
  {
    selectId: (item) => item.id,
  }
);
const initTodoTasksState: EventExploreListStore =
  eventExploreListEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    moreStatus: AsyncRequestStatus.IDLE,
    noMore: false,
    pageNumber: PAGE_NUMBER_FIRST,
    errorMsg: '',
    moreErrorMsg: '',
    currentRequestId: '',
    // daylightUid: '',
  });

// const getEventsByForu = async (
//   apiParams: EventExploreListParams,
//   daylightParmas: DaylightListParams
// ) => {
//   const daylightResponse = fetchListByDaylight(daylightParmas);
//   const trendingResponse = fetchListForEventExplore({
//     ...apiParams,
//     orderBy: OrderBy.TRENDING,
//   });
//   const [daylightData, trendingData] = await Promise.all([
//     daylightResponse,
//     trendingResponse,
//   ]);
//   // 如果trending数据请求有问题
//   if (trendingData.data.code === ApiRespCode.ERROR) {
//     throw new Error(trendingData.data.msg);
//   }
//   // 看过后隐藏的daylight数据从获取的数据中过滤掉
//   const hideIds = getHideDaylightIdsByStorage();
//   const daylightAbilityList = (daylightData.data?.abilities || []).filter(
//     (item) => !hideIds.includes(item.uid)
//   );
//   // 最终的event数据
//   const daylightEventList = daylightAbilityListToEventList(daylightAbilityList);
//   const trendingEventList = trendingData.data.data;

//   // 合并数据
//   const data = [...daylightEventList, ...trendingEventList];

//   // 最后一个daylight数据的uid
//   const daylightAfterUid =
//     daylightAbilityList[(daylightAbilityList.length || 1) - 1]?.uid;

//   return { data, daylightAfterUid };
// };
type AdaptationEventExploreListParams = EventExploreListParams;
// 重新获取列表
export const fetchEventExploreList = createAsyncThunk<
  Array<EventExploreListItem>,
  AdaptationEventExploreListParams
>(
  'event/explore/list',
  async (params, { rejectWithValue, dispatch, getState }) => {
    const apiParams = {
      ...params,
      pageSize: PAGE_SIZE,
      pageNumber: PAGE_NUMBER_FIRST,
    };
    // if (params.orderBy === OrderBy.FORU) {
    //   if (params.pubkey) {
    //     const state = getState() as RootState;
    //     const { eventExploreList } = state;
    //     const { daylightUid } = eventExploreList;
    //     const daylightParmas = {
    //       // pubkey: '0xee3ca4dd4ceb3416915eddc6cdadb4a6060434d4',
    //       pubkey: params.pubkey,
    //       after: daylightUid,
    //       limit: PAGE_SIZE,
    //     };
    //     const { data, daylightAfterUid } = await getEventsByForu(
    //       apiParams,
    //       daylightParmas
    //     );
    //     dispatch(setDaylightUid(daylightAfterUid));
    //     return data;
    //   }
    //   apiParams.orderBy = OrderBy.TRENDING;
    // }
    const resp = await fetchListForEventExplore(apiParams);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data.map((item) => ({
        ...item,
        id: item.isForU ? item.uuid : item.id,
      }));
    }
    return rejectWithValue(new Error(resp.data.msg));
  }
);

// 获取更多
export const fetchMoreEventExploreList = createAsyncThunk<
  Array<EventExploreListItem>,
  AdaptationEventExploreListParams
>(
  'event/explore/page',
  async (params, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const { eventExploreList } = state;
    const {
      pageNumber,
      // daylightUid
    } = eventExploreList;
    const apiParams = {
      ...params,
      pageSize: PAGE_SIZE,
      pageNumber: pageNumber + 1,
    };
    // if (params.orderBy === OrderBy.FORU && params.pubkey) {
    //   const daylightParmas = {
    //     // pubkey: '0xee3ca4dd4ceb3416915eddc6cdadb4a6060434d4',
    //     pubkey: params.pubkey,
    //     after: daylightUid,
    //     limit: PAGE_SIZE,
    //   };
    //   const { data, daylightAfterUid } = await getEventsByForu(
    //     apiParams,
    //     daylightParmas
    //   );
    //   dispatch(setDaylightUid(daylightAfterUid));
    //   return data;
    // }
    const resp = await fetchListForEventExplore(apiParams);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data.map((item) => ({
        ...item,
        id: item.isForU ? item.uuid : item.id,
      }));
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const { eventExploreList } = state;
      const { status, moreStatus } = eventExploreList;
      // 之前的请求正在进行中,则阻止新的请求
      if (
        status === AsyncRequestStatus.PENDING ||
        moreStatus === AsyncRequestStatus.PENDING
      ) {
        return false;
      }
      return true;
    },
  }
);

export const eventExploreListSlice = createSlice({
  name: 'eventExploreList',
  initialState: initTodoTasksState,
  reducers: {
    updateOne: (
      state,
      action: PayloadAction<Partial<EventExploreListItem>>
    ) => {
      const updateData = action.payload;
      eventExploreListEntity.updateOne(state, {
        id: updateData.id,
        changes: updateData,
      });
    },
    setOne: (...args) => eventExploreListEntity.setOne(...args),
    removeAll: (state) => eventExploreListEntity.removeAll(state),
    // setDaylightUid: (state, action: PayloadAction<string>) => {
    //   state.daylightUid = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventExploreList.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.pageNumber = 0;
        state.currentRequestId = action.meta.requestId;
        state.noMore = false;
      })
      .addCase(fetchEventExploreList.fulfilled, (state, action) => {
        const { currentRequestId } = state;
        const { requestId } = action.meta;
        // 多个异步请求返回时，使用最后一次请求返回的数据
        if (currentRequestId !== requestId) return;
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        eventExploreListEntity.setAll(state, action.payload);
      })
      .addCase(fetchEventExploreList.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        eventExploreListEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      })
      .addCase(fetchMoreEventExploreList.pending, (state, action) => {
        state.noMore = false;
        state.moreStatus = AsyncRequestStatus.PENDING;
        state.moreErrorMsg = '';
      })
      .addCase(fetchMoreEventExploreList.fulfilled, (state, action) => {
        state.moreStatus = AsyncRequestStatus.FULFILLED;
        state.moreErrorMsg = '';
        if (action.payload.length) {
          state.pageNumber += 1;
          eventExploreListEntity.addMany(state, action.payload);
        } else {
          state.noMore = true;
        }
      })
      .addCase(fetchMoreEventExploreList.rejected, (state, action) => {
        state.moreStatus = AsyncRequestStatus.REJECTED;
        state.moreErrorMsg = action.error.message || '';
      });
  },
});

const { actions, reducer } = eventExploreListSlice;
export const { selectAll, selectById } = eventExploreListEntity.getSelectors(
  (state: RootState) => state.eventExploreList
);
export const selectState = (state: RootState) => state.eventExploreList;
export const {
  updateOne,
  setOne,
  removeAll,
  // setDaylightUid
} = actions;
export default reducer;
