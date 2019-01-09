export const menus = [
    {
        'name': '系统概览',
        'icon': 'dashboard',
        'link': '/auth/overview',
        'open': true,
        'chip': false,
    },

    {
        'name': 'MDB配置',
        'icon': 'settings_ethernet',
        'link': false,
        'open': false,
        'chip': false,
        'sub': [
            {
                'name': '区块链数据服务',
                'icon': 'chevron_right',
                'link': '/auth/config/abci',
                'open': false,
            },
            {
                'name': '区块链接口服务',
                'icon': 'chevron_right',
                'link': '/auth/config/mdbserv',
                'open': false,
            },
            {
              'name': '区块链系统配置',
              'icon': 'chevron_right',
              'link': '/auth/config/distributednode',
              'open': false,
            },
            {
                'name': '区块链用户管理',
                'icon': 'chevron_right',
                'link': '/auth/config/mdbuser',
                'open': false,
            },
        ]

    },

    {
        'name': '系统设置',
        'icon': 'settings',
        'link': false,
        'open': false,
        'sub': [
            {
                'name': '管理用户',
                'link': '/auth/system/users',
                'icon': 'chevron_right',
                'chip': false,
                'open': false,
            },
            {
              'name': '关于....',
              'link': '/auth/system/aboutus',
              'icon': 'chevron_right',
              'chip': false,
              'open': false,
            },
            {
              'name': '用户许可协议',
              'link': '/auth/system/userlicenseagreement',
              'icon': 'chevron_right',
              'chip': false,
              'open': false,
            }
        ]
    },

];
