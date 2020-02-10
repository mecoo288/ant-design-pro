import { Icon, Tooltip, Tag } from 'antd';
import React from 'react';
import { connect } from 'dva';
import screenfull from 'screenfull';
import { formatMessage } from 'umi-plugin-react/locale';
import { ConnectProps, ConnectState } from '@src/models/connect';
import setting from '../../../config/defaultSettings';

import Avatar from './AvatarDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};
const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  state = {
    fullscreen: 0,
  }

  const { theme, layout } = props;
  let className = styles.right;
  f11 = () => {
    this.setState({
      fullscreen: screenfull.isFullscreen ? 0 : 1,
    });
    screenfull.toggle();
  };

  render() {
    const fullscreenIcon = ['fullscreen', 'fullscreen-exit'];
    const fullscreenText = ['ȫ��', '�˳�ȫ��'];
    const { fullscreen } = this.state;

    const { theme, layout } = this.props;
    let className = styles.right;

    if (theme === 'dark' && layout === 'topmenu') {
      className = `${styles.right}  ${styles.dark}`;
    }

    return (
      <div className={className}>
        {/* ȫ�� */}
        <Tooltip title={fullscreenText[fullscreen]}>
          <span className={styles.action} onClick={() => this.f11()}>
            <Icon type={fullscreenIcon[fullscreen]} />
          </span>
        </Tooltip>

        <Tooltip
          title={formatMessage({
            id: 'component.globalHeader.help',
          })}
        >
          <Icon type="question-circle-o" />
        </a>
      </Tooltip>
      <Avatar />
      {REACT_APP_ENV && <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>}
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
