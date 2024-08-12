import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

function errorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`
  } else if (error instanceof Error) {
    return error.message
  } else if (typeof error === 'string') {
    return error
  } else {
    console.error(error)
    return 'Unknown error'
  }
}

export default function ErrorPage() {
  const error = useRouteError()
  const errorMsg = errorMessage(error)

  return (
    <div className="h-dvh w-dvw bg-slate-300 flex flex-col gap-5 justify-center items-center text-3xl">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="font-bold text-4xl">{errorMsg}</p>
    </div>
  )
}
