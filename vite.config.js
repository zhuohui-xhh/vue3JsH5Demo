import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
// npm i  terser   -D  剔除console.log
// npm i vite-plugin-imagemin -D
import viteImagemin from 'vite-plugin-imagemin' //图片压缩
// npm i vite-plugin-compression -D
import viteCompression from 'vite-plugin-compression'
// https://vitejs.dev/config/
// 配置文件中访问环境变量
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  return {
    plugins: [
      vue(),
      // mock数据配置
      viteMockServe({
        // default
        mockPath: 'mock',
        localEnabled: command === 'serve'
      }),
      // 自动导入组件
      AutoImport({
        //预设名称或自定义导入映射: 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: [
          //这里相关的模块是可以自动更新到.eslintrc-auto-import.json，第三方的好像不行
          'vue',
          'vue-router',
          // 详细配置
          {
            axios: [
              // default imports
              ['default', 'axios'] // import { default as axios } from 'axios',
            ]
          }
        ],
        // 要自动导入的目录的路径,这里自动导入的是js文件，里面例如 可以
        // 可以省略这个引入：// import { getDay } from './util/util.js'
        // 直接调用getDay()
        dirs: ['./src/utils/**', './src/api/**'],

        // 自动导入 Vant Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [VantResolver()],
        // dts: './auto-import.d.ts', // 输出一个auto-imports.d.ts他的作用就是解决ts找不到变量的报错
        // 兼容eslintrc规则对自动导入变量未定义的错误提示
        eslintrc: {
          enabled: true, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
          filepath: './.eslintrc-auto-import.json', // 生成json文件
          globalsPropValue: true
        }
      }),
      // 自动注册组件
      Components({
        resolvers: [VantResolver()],
        // dirs:这里引入并注册了组件
        // 要自动导入的目录的路径 :这里的默认值也是：'./src/components'
        dirs: ['./src/components']
      }),
      //代码体积压缩--生成的gizp压缩文件需要nginx配置一个操作才可以正常访问
      viteCompression({
        algorithm: 'gzip',
        threshold: 10240,
        verbose: false,
        // 配置：是否删除源文件，如果是npm run build:test 不删除源文件方便做本地预览npm run preview;
        // 如果是npm run build:pro ;这删除压缩后的源文件，减小包体积，方便做部署；
        deleteOriginFile: isProduction
      }),
      // 图片压缩
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 20
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        // 配置scr路径别名
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variables.module.scss";'
        }
      }
    },
    // 本地代理服务器
    server: {
      port: env.VITE_APP_PORT, // 端口:使用的是，环境变量中的配置
      https: false, // 是否开启 https
      hmr: true, // 是否开启自动刷新
      open: true, // 是否开启自动打开浏览器
      cors: true, //为开发服务器配置 CORS , 默认启用并允许任何源
      // 反向代理配置
      proxy: {
        // 带选项写法：http://localhost:5173/api/bar
        //-> http://jsonplaceholder.typicode.com/bar
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    //打包配置 默认这里是生产环境运行
    build: {
      //浏览器兼容性  "esnext"|"modules"
      target: 'modules',
      //指定输出路径
      outDir: 'dist',
      //生成静态资源的存放路径
      assetsDir: 'assets',
      //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
      assetsInlineLimit: 4096,
      //启用/禁用 CSS 代码拆分
      cssCodeSplit: true,
      //构建后是否生成 source map 文件
      sourcemap: false,
      //自定义底层的 Rollup 打包配置
      rollupOptions: {
        // 代码分割，配合组件的按需引入
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`
        }
      },
      //@rollup/plugin-commonjs 插件的选项
      commonjsOptions: {},
      //构建的库
      // lib: {},
      //当设置为 true，构建后将会生成 manifest.json 文件
      manifest: false,
      // 设置为 false 可以禁用最小化混淆，
      // 或是用来指定使用哪种混淆器
      // boolean | 'terser' | 'esbuild'
      minify: 'terser', //terser 构建后文件体积更小
      //传递给 Terser 的更多 minify 选项。
      terserOptions: {
        //生产环境不要日志，去掉console,debugger
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction
        }
      },
      //设置为 false 来禁用将构建后的文件写入磁盘
      write: true,
      //默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
      emptyOutDir: true,
      //启用/禁用 brotli 压缩大小报告
      // brotliSize: true,
      //chunk 大小警告的限制
      chunkSizeWarningLimit: 500
    }
  }
})
