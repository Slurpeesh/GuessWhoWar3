import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import { setAllSeen } from '@/app/store/slices/messagesSlice'
import Modal from '@/shared/Modal/Modal'
import { forwardRef, MutableRefObject, useEffect } from 'react'
import LobbyChat from '../LobbyChat/LobbyChat'

const MobileModalChat = forwardRef(function MobileModalChat(
  props,
  ref: MutableRefObject<HTMLDivElement>
) {
  const messages = useAppSelector((state) => state.messages.value)
  const dispatch = useAppDispatch()

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight
  }, [])

  useEffect(() => {
    dispatch(setAllSeen())
  }, [messages])

  return (
    <Modal>
      <LobbyChat ref={ref} />
    </Modal>
  )
})

export default MobileModalChat
