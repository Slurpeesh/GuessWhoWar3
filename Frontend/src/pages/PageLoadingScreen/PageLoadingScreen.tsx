import LoaderSvg from '@/entities/Loader/Loader'

export default function PageLoadingScreen() {
  return (
    <div
      className="flex flex-col gap-5 justify-center items-center w-dvw h-dvh bg-background"
      role="status"
    >
      <LoaderSvg />
    </div>
  )
}
