import { useAppSelector } from '@/app/hooks/useActions'

export default function Messages() {
  const messages = useAppSelector((state) => state.messages.value)
  return (
    <ul>
      {messages.map((message, index) => (
        <li key={index}>{message.value}</li>
      ))}
    </ul>
  )
}
