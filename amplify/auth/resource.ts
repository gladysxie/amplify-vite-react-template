import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true, // 启用邮箱登录
  },
  verification: {
    email: true, // 注册后需要邮箱验证
  },
});

