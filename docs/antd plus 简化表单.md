# ⚡ Ant Plus

Ant Plus 是 [Ant Design Form](https://ant.design/components/form-cn/) 的简化版。此刻起，以你最熟悉的方式来搭建 Form。

[![npm version](https://img.shields.io/npm/v/antx.svg?style=flat-square)](https://www.npmjs.com/package/antx) [![npm downloads](https://img.shields.io/npm/dt/antx.svg?style=flat-square)](http://www.npmtrends.com/antx) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/antx?style=flat-square)](https://bundlephobia.com/result?p=antx) [![GitHub](https://img.shields.io/github/license/nanxiaobei/ant-plus.svg?style=flat-square)](https://github.com/nanxiaobei/ant-plus/blob/master/LICENSE)

## 对比

使用 Ant Plus 与 Ant Design 搭建 Form 的代码对比。

![代码对比图](https://raw.githubusercontent.com/nanxiaobei/ant-plus/master/contrast/demo.png)

## 文档

[https://nanxiaobei.github.io/ant-plus](https://nanxiaobei.github.io/ant-plus)

## 特点

- **极其简便**：符合直觉，告别繁琐的 `form.getFieldDecorator` 与冗长的 `rules`。
- **统一提示**：简化 `rules` 代码，可全局定义校验提示，告别烦乱的自定义与不可控。
- **简化 API**：对 Form 相关组件的常用 API 进行了简化，一切只为更流畅的开发。
- **渐进增强**：对组件原有使用方式全部兼容，在基础之上，进行了功能的拓展与简化。

## 安装

```sh
yarn add antx
```

或

```sh
npm install antx
```

## 示例

[![Edit antx](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/antx-mqxxzrj87j?fontsize=14)

## 使用

```jsx harmony
import { Form, Input, Button } from 'antx';

const Demo = ({ form }) => (
  <Form api={form} data={{ username: 'Emily' }}>
    <Input label="用户名" id="username" rules={['required', 'max=10']} max={10} msg="full" />
    <Button htmlType="submit">提交</Button>
  </Form>
);

export default Form.create()(Demo);
```

表单域组件的 Props 中，`id` 为表单域唯一标识，`label` 为 Form.Item 的 `label`。[`getFieldDecorator(id, options)`](<https://ant.design/components/form-cn/#getFieldDecorator(id,-options)-%E5%8F%82%E6%95%B0>) `options` 参数中的项，均可直接用于组件的 Props，如 `rules`、`initialValue` 等。

Ant Plus 还对 `rules` 做了优化，可使用简洁的字符串，来设置校验规则。同时提供了体验更好的校验提示 UI。

是的，一切就是如此的简洁清晰。完整使用介绍，请查阅 [Ant Plus Form 组件文档](https://nanxiaobei.github.io/ant-plus/#/form)。

## 协议

[MIT License](https://github.com/nanxiaobei/ant-plus/blob/master/LICENSE) (c) [nanxiaobei](https://mrlee.me/)
