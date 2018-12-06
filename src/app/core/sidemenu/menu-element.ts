export const menus = [
    {
        'name': '配置概览',
        'icon': 'dashboard',
        'link': '/auth/overview',
        'open': true,
        'chip': false,
    },
    {
      'name': '身份管理',
      'icon': 'account_box',
      'link': '/auth/config/identity-managent',
      'open': false,
    },
    {
        'name': '主机管理',
        'icon': 'computer',
        'link': '/auth/config/host-managent',
        'open': false,
    },
    {
      'name': '容器配置管理',
      'icon': 'battery_full',
      'link': '/auth/config/container-managent',
      'open': false,
    },
    {
        'name': '通道管理',
        'icon': 'gps_not_fixed',
        'link': '/auth/config/passageway-managent',
        'open': false,
    },
    {
      'name': '消息管理',
      'icon': 'message',
      'link': '/auth/config/news-managent',
      'open': false,
    },
    {
        'name': '系统设置',
        'icon': 'settings',
        'link': false,
        'open': false,
        'sub': [
            {
                'name': '用户管理',
                'link': '/auth/system/users',
                'icon': 'chevron_right',
                'chip': false,
                'open': false,
            },
        ]
    },

];
