import React, { Component } from 'react';
import { Modal, Table, Checkbox } from 'antd';
import { connect } from 'dva';

@connect(state => ({
  role: state.role,
  loading: state.loading.role,
}))
export default class RoleModule extends Component {
  // 关闭窗口
  handleCancel = () => {
    this.props.dispatch({
      type: 'role/updateState',
      payload: {
        operateType: '',
      },
    });
  };

  // 保存模块关系
  handleSubmit = () => {
    const { roleId } = this.props.role;
    const { checked, checkedResource } = { ...this.props.role.modules };
    const modules = checked && checked.map(item => ({ moduleId: item }));

    this.props.dispatch({
      type: 'role/saveModule',
      payload: {
        id: roleId,
        modules,
        resources: checkedResource,
      },
    });
  };

  // 暂存已选
  handleSelectRows = checkedKeys => {
    this.props.dispatch({
      type: 'role/updateState',
      payload: {
        modules: {
          ...this.props.role.modules,
          checked: checkedKeys,
        },
      },
    });
  };

  // 保存已选资源
  handleResourceClick = (e, rid) => {
    const { checked, checkedResource } = { ...this.props.role.modules };

    if (e.length < 1) {
      Modal.warning({
        title: '警告',
        content: '至少选择一个资源',
      });
      return;
    }
    checkedResource[rid] = e;
    // 勾选资源自动选择菜单
    if (e.length > 0 && checked.indexOf(rid) < 0) {
      checked.push(rid);
    }

    this.props.dispatch({
      type: 'role/updateState',
      payload: {
        modules: {
          ...this.props.role.modules,
          checked,
          checkedResource,
        },
      },
    });
  };

  render() {
    const { loading } = this.props;
    const { operateType, modules } = this.props.role;

    const columns = [
      {
        title: '模块名称',
        dataIndex: 'name',
      },
      {
        title: '资源权限',
        align: 'left',
        dataIndex: 'resources',
        render: (item, record) => {
          const options = item && item.map(r => ({ label: r.resourceDesc, value: r.id }));

          const checkedResource = modules && modules.checkedResource;
          const rsr = checkedResource[record.id];
          // eslint-disable-next-line max-len
          return (
            <Checkbox.Group
              options={options}
              value={rsr}
              onChange={e => this.handleResourceClick(e, record.id)}
            />
          );
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys: modules.checked,
      onChange: selectedKeys => {
        this.handleSelectRows(selectedKeys);
      },
    };

    return (
      <Modal
        visible={operateType === 'Module'}
        title="选择授权模块"
        okText="确定"
        cancelText="关闭"
        width="45%"
        onOk={() => this.handleSubmit()}
        onCancel={() => this.handleCancel()}
        bodyStyle={{ height: 456, maxHeight: 456, padding: 0, overflowY: 'auto' }}
      >
        <Table
          size="small"
          style={{ height: 456, maxHeight: 456 }}
          defaultExpandAllRows
          columns={columns}
          dataSource={modules.records}
          loading={loading}
          pagination={false}
          rowKey={record => record.id}
          rowSelection={rowSelection}
        />
      </Modal>
    );
  }
}
