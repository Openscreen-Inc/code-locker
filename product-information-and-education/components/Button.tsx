interface ButtonProps {
  text?: string
  onClick?: () => void
}

const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      className="px-4 py-2 font-semibold text-white transition bg-blue-500 border-4 border-transparent rounded-full shadow-sm hover:text-black hover:bg-white focus:border-blue-800"
      onClick={() => onClick && onClick()}
    >
      {text}
    </button>
  )
}

export default Button
