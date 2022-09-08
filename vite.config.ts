import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const theme = 'theme_1';
  return {
    plugins: [
      vue(),
      vueJsx(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
          })
        ]
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import ~"@/assets/css/${theme}.less";`
          },
          javascriptEnabled: true
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // https: true,
      proxy: {
        '/api': {
          target: '', // http 接口地址
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '/')
        },
        '/socket': {
          target: '', // socket 接口地址
          ws: true,
          changeOrigin: true, //是否允许跨域
          rewrite: path => path.replace(/^\/socket/, '/')
        }
      }
    }
  }
})
