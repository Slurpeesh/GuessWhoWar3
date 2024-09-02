import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const queries = [
  '(max-width: 449.999px)',
  '(min-width: 450px) and (max-width: 1099.999px)',
  '(min-width: 1100px)',
]

type Device = 'mobile' | 'tablet' | 'desktop'

export function defineDevice(matches: Array<boolean>): Device {
  for (let i = 0; i < matches.length; i++) {
    if (matches[i]) {
      switch (i) {
        case 0:
          return 'mobile'
        case 1:
          return 'tablet'
        case 2:
          return 'desktop'
      }
    }
  }
  throw new Error('No device was defined')
}

export const mediaDeviceQueriesList = queries.map((query) => matchMedia(query))

const matches = mediaDeviceQueriesList.map((query) => query.matches)

const initialDevice: Device = defineDevice(matches)

export interface IDeviceState {
  value: Device
}

const initialState: IDeviceState = {
  value: initialDevice,
}

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDevice: (state, action: PayloadAction<Device>) => {
      state.value = action.payload
    },
  },
})

export const { setDevice } = deviceSlice.actions
export const selectDevice = (state: RootState) => state.device.value
export default deviceSlice.reducer
