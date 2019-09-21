import React from 'react';
import { Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import cx from 'classnames';
import DataTable from '@/components/DataTable';

@connect(state => ({
  role: state.role,
  loading: state.loading.effects['role/fetchRoles'],
}))
export default class List extends React.PureComponent {
  // 组件加载完成后加载数据
  componentDidMount() {
    this.props.dispatch({
      type: 'role/fetchRoles',
    });
  }

  // 行选事件
  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'role/updateState',
      payload: { selectedRowKeys: rows },
    });
  };

  // 单条删除
  handleDeleteClick = record => {
    this.props.dispatch({
      type: 'role/remove',
      payload: {
        param: [record.id],
      },
    });
  };

  // 编辑
  handleEditClick = record => {
    this.props.dispatch({
      type: 'role/edit',
      payload: {
        modalType: 'edit',
        id: record.id,
      },
    });
  };

  // 翻页
  pageChange = pg => {
    const { dispatch, searchForm } = this.props;
    const { pageNum, pageSize } = pg;

    const params = {
      pageNo: pageNum,
      pageSize,
      ...searchForm.getFieldsValue(),
    };

    dispatch({
      type: 'role/fetchRoles',
      payload: params,
    });
  };

  render() {
    const { loading } = this.props;

    const { roles, selectedRowKeys } = this.props.role;

    const columns = [
      {
        title: '角色名称',
        name: 'name',
        tableItem: {},
      },
      {
        title: '角色编码',
        name: 'code',
        tableItem: {},
      },
      {
        title: '状态',
        tableItem: {
          render: (text, record) =>
            record.locked === '0000' && (
              <DataTable.Oper>
                <a onClick={e => this.handleEditClick(record, e)}>编辑</a>
              </DataTable.Oper>
            ),
        },
      },
      {
        title: '备注',
        name: 'remark',
      },
      {
        title: '模块授权',
        align: 'center',
        tableItem: {
          render: (text, record) =>
            record.locked === '0000' && (
              <DataTable.Oper>
                <a onClick={e => this.handleEditClick(record, e)}>模块授权</a>
              </DataTable.Oper>
            ),
        },
      },
      {
        title: '用户授权',
        align: 'center',
        tableItem: {
          render: (text, record) =>
            record.locked === '0000' && (
              <DataTable.Oper>
                <a onClick={e => this.handleEditClick(record, e)}>用户授权</a>
              </DataTable.Oper>
            ),
        },
      },
      {
        title: '配置授权',
        align: 'center',
        tableItem: {
          render: (text, record) =>
            record.locked === '0000' && (
              <DataTable.Oper>
                <a onClick={e => this.handleEditClick(record, e)}>配置授权</a>
              </DataTable.Oper>
            ),
        },
      },
      {
        title: '操作',
        tableItem: {
          render: (text, record) =>
            record.locked === '0000' && (
              <DataTable.Oper>
                <a onClick={e => this.handleEditClick(record, e)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定要删除吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => this.handleDeleteClick(record)}
                >
                  <a>删除</a>
                </Popconfirm>
              </DataTable.Oper>
            ),
        },
      },
    ];

    const dataTableProps = {
      columns,
      rowKey: 'id',
      loading,
      isScroll: true,
      alternateColor: true,
      dataItems: roles,
      selectType: 'checkbox',
      rowClassName: record =>
        cx({ locked: record.locked === '0001', disabled: record.locked === '9999' }),
      selectedRowKeys,
      onChange: this.pageChange,
      onSelect: this.handleSelectRows,
      disabled: { locked: ['9999', '0001'] },
      rowSelection: {
        // 系统内置分组不可选择
        getCheckboxProps: record => ({
          disabled: record.locked === '9999',
          name: record.name,
        }),
      },
    };

    return <DataTable {...dataTableProps} bordered />;
  }
}
