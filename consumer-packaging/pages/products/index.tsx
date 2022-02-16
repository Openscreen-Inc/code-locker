import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Logo from '@public/maple-and-lather-logo.webp'
import Button from '@components/Button'
import axios from 'axios'
import { Asset, GetAssetsByProjectIdResponseBody } from '@openscreen/sdk'

interface ProductPageProps {
  asset: Asset
}

enum SubscribeStatus {
  Ready,
  Pending,
  Done,
  Error,
}

const ProductPage = ({ asset }: ProductPageProps) => {
  const [email, setEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeStatus>(
    SubscribeStatus.Ready
  )
  const [errorMsg, setErrorMsg] = useState(
    'Something went wrong. Please try again in a moment.'
  )
  const router = useRouter()
  //@ts-ignore
  const productName = asset.customAttributes?.name || ''
  //@ts-ignore
  const redirect = asset.customAttributes?.redirect || ''

  /**
   * Subscribe (ie. create Openscreen contact object) and redirect to product information page.
   */
  const subscribeAndRedirect = async () => {
    try {
      setSubscribeStatus(SubscribeStatus.Pending)
      await axios.post('/api/subscribe', {
        email,
        origin: window.location.href,
      })
      setSubscribeStatus(SubscribeStatus.Done)
      router.push(redirect)
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMsg(err.response.data)
      }
      setSubscribeStatus(SubscribeStatus.Error)
    }
  }

  const getStatusText = () => {
    switch (subscribeStatus) {
      case SubscribeStatus.Pending:
        return 'Subscribing...'
      case SubscribeStatus.Done:
        return 'Subscribed. Redirecting you in a moment...'
      case SubscribeStatus.Error:
        return errorMsg
      default:
        return ''
    }
  }

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
      <div className="flex items-center justify-center w-full min-h-screen p-8">
        <div className="flex flex-col items-center justify-center w-full max-w-5xl space-y-6">
          <Image
            src={Logo.src}
            alt="Maple & Lather logo"
            width="320"
            height="28"
          />
          <div className="text-2xl text-center">
            Thank you for your interest in {productName}. Subscribe to our
            mailing service to receive special offers on our products.
          </div>
          <div className="w-full space-y-4 sm:w-96">
            <label className="flex flex-col justify-start text-3xl">
              Email
              <input
                type="text"
                className="border-2 border-black rounded"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </label>
            <div className="flex items-center justify-end space-x-4 text-xl">
              <a
                href={redirect}
                className="text-black underline hover:text-blue-500"
              >
                skip
              </a>
              <Button text="Continue" onClick={subscribeAndRedirect} />
            </div>
          </div>
          <div className="text-center">{getStatusText()}</div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { name } = context.query
  try {
    const publicUrl = process.env.PUBLIC_URL
    if (publicUrl) {
      const asset = await axios.get<GetAssetsByProjectIdResponseBody>(
        `${publicUrl}/api/asset?assetName=${name}`
      )

      if (asset.data.assets && asset.data.assets.length > 0) {
        return {
          props: {
            asset: asset.data.assets?.[0],
          },
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
  // cannot retrieve asset, return 404
  return {
    notFound: true,
  }
}

export default ProductPage
