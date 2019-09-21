import { fetchRoles, delRole, saveRole, checkUnique, lockRole } from '../services/roleSvc';

export default {
  namespace: 'role',
  state: {
    currentItem: {},
    modalType: '',
    selectedRowKeys: [],
    formValues: {},
  },
  effects: {
    // 校验编码唯一性
    *checkUnique({ payload }, { call }) {
      return yield call(checkUnique, payload);
    },
    // 切换锁定状态
    *lockSwitch({ payload }, { call, put }) {
      yield call(lockRole, payload);
      yield put({ type: 'fetchRoles' });
    },
    // 加载权限列表
    *fetchRoles({ payload }, { call, put }) {
      const response = yield call(fetchRoles, payload);
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: [],
            roles: response.data,
          },
        });
      }
    },
    // 删除
    *remove({ payload }, { call, put }) {
      const response = yield call(delRole, payload);
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            roles: response.data,
            selectedRowKeys: [],
          },
        });
      }
    },
    // 保存提交
    *save({ payload }, { call, put }) {
      const response = yield call(saveRole, payload);
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalType: '',
            currentItem: {},
            roles: response.data,
          },
        });
      }
    },
    // 新增/新增子节点
    // 编辑按钮
    // 排序
    // 保存一条模块信息
    // 更改可用状态
    // 删除数据
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
