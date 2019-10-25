import modelExtend from 'dva-model-extend';
import { model } from '@src/common/model/BaseModel';
import { message } from 'antd';
import {
  listCategory,
  checkUnique,
  editCategory,
  getCategory,
  deleteCategory,
  switchCategory,
} from '../services/CategorySvc';

export default modelExtend(model, {
  namespace: 'category',
  state: {
    currentItem: {},
    modalType: '',
    selectedRowKeys: [],
    formValues: {},
  },
  effects: {
    // 校验分类编码唯一性
    *checkUnique({ payload }, { call }) {
      return yield call(checkUnique, payload);
    },
    // 查询
    *list({ payload }, { call, put }) {
      // 查询数据
      const response = yield call(listCategory, payload);
      if (response && response.data) {
        yield put({
          type: 'saveData',
          payload: response.data,
        });
      }
    },
    // 新增/新增子节点
    *create({ payload }, { call, put }) {
      // 有id时为新增下级，加载父级节点相关信息
      yield put({
        type: 'updateState',
        payload: {
          ...payload,
        },
      });
    },
    // 编辑按钮
    *edit({ payload }, { call, put }) {
      const response = yield call(getCategory, payload);
      if (response && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'edit',
            currentItem: response.data,
          },
        });
      }
    },
    // 保存一条模块信息
    *save({ payload }, { call, put }) {
      const response = yield call(editCategory, payload);
      if (response && response.data) {
        //  关闭窗口 - 提示成功 - 加载数据
        yield put({
          type: 'updateState',
          payload: {
            modalType: '',
            currentItem: {},
            data: response.data,
          },
        });
        message.success('操作成功');
      } else {
        yield put({
          type: 'updateState',
          payload: {
            modalType: '',
            currentItem: {},
          },
        });
        message.success('操作失败');
      }
    },
    // 更改可用状态
    *changeStatus({ payload }, { call, put }) {
      const response = yield call(switchCategory, payload);
      if (response) {
        payload.record.status = payload.status;
        yield put({
          type: 'updateState',
          currentItem: payload.record,
        });
      }
    },
    // 删除数据
    *delete({ payload, callback }, { call, put }) {
      // 查询数据
      const response = yield call(deleteCategory, payload);
      // 只有返回成功时才刷新
      if (response && response.success) {
        // 从当前数据对象中找到响应ID记录删除值
        yield put({
          type: 'updateState',
          payload: {
            data: response.data,
            selectedRowKeys: [],
          },
        });
        if (callback) {
          callback();
        }
      } else {
        message.error(`操作失败： ${response.message || '请联系管理员'}.`);
        yield put({
          type: 'updateState',
          payload: {
            loading: { global: false },
          },
        });
      }
    },
  },
});
