import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Divider, Popconfirm, Form, Input, Button, Alert, Tree } from 'antd';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SideLayout from '@src/components/SideLayout';
import RoleModal from './rolemodal';
import List from './list';
import AOEForm from './aoeform';

@connect(state => ({
  account: state.account,
}))
export default class extends React.PureComponent {
  formRef = React.createRef();

  // 组件加载完成后加载数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetch',
    });
  }

  // 解锁/锁定
  handleLockSwitch = status => {
    const {
      account: { selectedRowKeys },
    } = this.props;
    this.props.dispatch({
      type: 'account/lockSwitch',
      payload: {
        param: selectedRowKeys,
        status,
      },
    });
  };

  // 搜索事件
  handleSearch = e => {
    e.preventDefault();

    const { dispatch } = this.props;
    const { validateFields } = this.formRef.current;
    // 表单验证
    validateFields().then(values => {
      dispatch({
        type: 'account/fetchUser',
        payload: { ...values },
      });
    });
  };

  // 重置事件
  handleFormReset = () => {
    const { dispatch } = this.props;
    const { resetFields } = this.formRef.current;
    resetFields();

    dispatch({
      type: 'account/fetchUser',
      payload: {},
    });
  };

  // 清除选择
  cleanSelectedKeys = () => {
    this.props.dispatch({
      type: 'account/updateState',
      payload: { selectedRowKeys: [] },
    });
  };

  // 树节点选择
  handleTreeSelect = selectedKeys => {
    const { dispatch } = this.props;
    const values = {
      deptId: selectedKeys[0],
    };
    dispatch({
      type: 'account/fetchUser',
      payload: values,
    });
  };

  // 新增窗口
  handleModalVisible = () => {
    this.props.dispatch({
      type: 'account/updateState',
      payload: {
        modalType: 'create',
        currentItem: {},
      },
    });
  };

  // 批量删除
  handleRemoveClick = () => {
    const { selectedRowKeys } = this.props.account;

    if (!selectedRowKeys) return;

    this.props.dispatch({
      type: 'account/remove',
      payload: {
        param: selectedRowKeys,
      },
    });
  };

  // 渲染左侧树
  renderTree() {
    const { orgs } = this.props.account;
    return <Tree showLine blockNode onSelect={this.handleTreeSelect} treeData={orgs} />;
  }

  // 操作按钮
  renderButton(selectedRowKeys) {
    return <>
      <Button type="primary" onClick={() => this.handleModalVisible(true, 'create')}>
        新增用户
      </Button>
      {selectedRowKeys.length > 0 && (
        <>
          <Divider type="vertical" />
          <span>
            <Popconfirm
              title="确定要删除所选用户吗?"
              placement="top"
              onConfirm={this.handleRemoveClick}
            >
              <Button style={{ marginLeft: 8 }} type="danger" icon={<LegacyIcon type="remove" />}>
                删除用户
              </Button>
            </Popconfirm>
          </span>
        </>
      )}
      {selectedRowKeys.length > 0 && (
        <>
          <Divider type="vertical" />
          <Button
            icon={<LockOutlined />}
            style={{ marginLeft: 8 }}
            onClick={() => this.handleLockSwitch('0001')}
          >
            锁定
          </Button>
        </>
      )}
      {selectedRowKeys.length > 0 && (
        <>
          <Divider type="vertical" />
          <Button
            icon={<UnlockOutlined />}
            style={{ marginLeft: 8 }}
            onClick={() => this.handleLockSwitch('0000')}
          >
            解锁
          </Button>
        </>
      )}
    </>;
  }

  // 简单搜索条件
  renderSearchForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline" ref={this.formRef}>
        <Form.Item label="帐号" name="account">
          <Input id="account-search" placeholder="输入帐号搜索" />
        </Form.Item>
        <Form.Item label="姓名" name="name">
          <Input id="account-name-search" placeholder="输入用户名称搜索" />
        </Form.Item>
        <Form.Item label="手机" name="tel">
          <Input id="account-phone-search" placeholder="输入手机号搜索" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Divider type="vertical" />
          <Button htmlType="reset" onClick={() => this.handleFormReset()}>
            重置
          </Button>
        </Form.Item>
      </Form>
    );
  }

  render() {
    const { selectedRowKeys, modalType, roleModal } = this.props.account;
    return (
      <PageHeaderWrapper title="用户管理" subTitle="系统用户账号管理维护">
        <div className="eva-ribbon">
          {/* 操作按钮 */}
          <div>{this.renderButton(selectedRowKeys)}</div>
          {/* 查询条件 */}
          <div>{this.renderSearchForm()}</div>
        </div>
        {/* 删除条幅 */}
        <div className="eva-alert">
          <Alert
            message={
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {selectedRowKeys.length > 0 && (
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空选择
                  </a>
                )}
              </div>
            }
            type="info"
            showIcon
          />
        </div>

        <div className="eva-body">
          <SideLayout
            title="所属部门"
            layoutStyle={{ minHeight: 'calc(100vh - 332px)' }}
            body={this.renderTree()}
          >
            {/* 用户列表 */}
            <List searchForm={this.formRef.current} />
          </SideLayout>
        </div>
        {/* 新增窗口 */}
        {modalType !== '' && <AOEForm />}
        {roleModal !== '' && <RoleModal />}
      </PageHeaderWrapper>
    );
  }
}
