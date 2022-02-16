import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Product from '@components/Product'
import { soaps } from '@data/soaps'
import AlpineCedar from '@public/qrcodes/alpine-cedar.png'
import LavenderFlower from '@public/qrcodes/lavender-flower.png'
import Maple from '@public/qrcodes/maple.png'
import LemonVerbena from '@public/qrcodes/lemon-verbena.png'
import NorthernMint from '@public/qrcodes/northern-mint.png'
import OrangeBergamot from '@public/qrcodes/orange-bergamot.png'

const Home = () => {
  return (
    <div>
      <Head>
        <title>Openscreen Code Locker - Consumer Packaging</title>
        <meta
          name="description"
          content="This sample app provides an example of how to use a dynamic and trackable QR Code to give consumers information about a specific product SKU."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center w-full min-h-screen overflow-scroll">
        <div className="flex flex-col items-center justify-center h-full max-w-screen-xl space-y-4">
          <div className="text-3xl text-center">
            {`Scan one of the QR codes to proceed to its' product information page.`}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Product
              id={soaps[0].id}
              name={soaps[0].name}
              src={AlpineCedar.src}
              color="#4C636F"
            />
            <Product
              id={soaps[1].id}
              name={soaps[1].name}
              src={LavenderFlower.src}
              color="#825E9C"
            />
            <Product
              id={soaps[2].id}
              name={soaps[2].name}
              src={Maple.src}
              color="#D18657"
            />
            <Product
              id={soaps[3].id}
              name={soaps[3].name}
              src={LemonVerbena.src}
              color="#D6D29A"
            />
            <Product
              id={soaps[4].id}
              name={soaps[4].name}
              src={NorthernMint.src}
              color="#A9B543"
            />
            <Product
              id={soaps[5].id}
              name={soaps[5].name}
              src={OrangeBergamot.src}
              color="#FFBD6C"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // prevent QR codes on this page from being cached
  context.res.setHeader('Cache-Control', 'no-store')

  return {
    props: {},
  }
}

export default Home
