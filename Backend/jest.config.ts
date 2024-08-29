import {
  type JestConfigWithTsJest,
  createDefaultPreset,
  pathsToModuleNameMapper,
} from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const defaultPreset = createDefaultPreset()

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  ...defaultPreset,
}

export default jestConfig
