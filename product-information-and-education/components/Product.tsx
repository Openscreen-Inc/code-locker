import Image from 'next/image'
import { CSSProperties } from 'react'

interface ProductProps {
  id: string
  name: string
  src: string
  color: string
}

const Product = ({ id, name, src, color }: ProductProps) => {
  const style = { '--color': color } as CSSProperties
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <a
        href={`/products?name=${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl text-black underline hover:text-blue-500"
      >
        {name}
      </a>
      <div className="border-corner" style={style}>
        <Image src={src} alt={`QR code for ${name}`} width="350" height="350" />
      </div>
    </div>
  )
}

export default Product
