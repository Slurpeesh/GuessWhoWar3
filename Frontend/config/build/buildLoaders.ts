import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactRefreshTypescript from 'react-refresh-typescript'
import { ModuleOptions } from 'webpack'
import { BuildOptions } from './types/types'

export function buildLoaders({ mode }: BuildOptions): ModuleOptions['rules'] {
  const isDev = mode === 'development'

  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif|woff2)$/i,
    type: 'asset/resource',
  }

  const svgrLoader = {
    oneOf: [
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              svgrConfig: {
                plugins: [
                  {
                    name: 'convertColors',
                    params: {
                      currentColor: true,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  }

  const cssLoaderWithModules = {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]',
      },
    },
  }

  const postCssLoader = {
    loader: 'postcss-loader',
    options: { sourceMap: true },
  }

  const scssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      cssLoaderWithModules,
      postCssLoader,
      'sass-loader',
    ],
  }

  const tsLoader = {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: isDev,
          getCustomTransformers: () => {
            before: [isDev && ReactRefreshTypescript()].filter(Boolean)
          },
        },
      },
    ],
    exclude: /node_modules/,
  }

  return [assetLoader, scssLoader, tsLoader, svgrLoader]
}
