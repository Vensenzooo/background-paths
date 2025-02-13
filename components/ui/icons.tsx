import { SVGProps } from "react"

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

export const Icons = {
  spinner: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v4m0 8v4m4-4h4m-8 0H4m4-4H4m8 0h4m-4-4h4m-4 0H4"
      />
    </svg>
  ),
  
  gitHub: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5 1A5.44 5.44 0 0 0 1.56 4.77 5.07 5.07 0 0 0 1 5c0 5.46 3.3 6.65 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  
  google: (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16.8 7.1c-.4-.7-.9-1.2-1.5-1.5-.6-.3-1.3-.4-2-.4-2.7 0-4.9 2.2-4.9 4.9v.1h-.1c0 1.3.4 2.5 1.1 3.5.6.9 1.5 1.6 2.6 2.1 1.1.5 2.4.8 3.8.8 1.4 0 2.7-.3 3.8-.9.7-.5 1.2-1.3 1.2-2.2v-.1h.1c0-1.7-.7-3.2-1.9-4.2-.5-.4-1.1-.7-1.8-.8zM12 16.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" />
    </svg>
  )
} as const

export type Icon = keyof typeof Icons

