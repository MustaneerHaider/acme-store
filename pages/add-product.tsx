import { Loader } from '@mantine/core'
import Head from 'next/head'
import { ChangeEvent, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Header from '../components/Header'
import { UploadIcon } from '@heroicons/react/solid'
import { useMutation } from '@apollo/client'
import { CREATE_PRODUCT_MUTATION } from '../graphql/operations'
import { useSession } from 'next-auth/react'
import Layout from '../components/Layout'

interface FormInputs {
  title: string
  price: Number
  description: string
}

function AddProduct() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [productImage, setProductImage] = useState<string>('')
  const filePickerRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [createProduct] = useMutation(CREATE_PRODUCT_MUTATION)
  const { data: session } = useSession()

  const handleAddProduct: SubmitHandler<FormInputs> = async ({
    title,
    price,
    description,
  }) => {
    if (!productImage) return
    setIsSubmitting(true)
    const result = await createProduct({
      variables: {
        input: {
          title,
          price,
          image: productImage,
          description,
          userId: session?.user.id,
        },
      },
    }).catch((err) => {
      setIsSubmitting(false)
    })
    setIsSubmitting(false)
    reset({ title: '', price: '', description: '' })
    console.log(result)
  }

  const addImageToProduct = async (e: ChangeEvent<HTMLInputElement>) => {
    if (uploading) return
    const file = e.target.files![0]
    if (file) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', 'acme-store')

      setUploading(true)
      const result = await fetch(
        'https://api.cloudinary.com/v1_1/diezkb6ih/image/upload',
        {
          method: 'POST',
          body: fd,
        }
      ).then((res) => res.json())
      console.log(result)
      setUploading(false)
      setProductImage(result.secure_url)
    }
  }

  return (
    <Layout title="Add Product" showFooter={false}>
      <main className="mx-5 mt-10 max-w-lg sm:mx-auto">
        <form
          onSubmit={handleSubmit(handleAddProduct)}
          className="flex flex-col bg-black py-10 px-12"
        >
          <h1 className="text-center font-roboto text-4xl font-bold text-white">
            Add Product
          </h1>
          <div className="mt-8">
            <input
              {...register('title', { required: true, minLength: 5 })}
              type="text"
              className={`inputField w-full ${
                errors.title && 'border-red-500 focus:ring-red-600'
              }`}
              placeholder="Title"
            />
            {errors.title && (
              <p className="p-1 text-[13px] text-red-500">
                Title should be atleast 5 characters long.
              </p>
            )}
          </div>
          {!productImage ? (
            <div className="mt-3">
              <input
                hidden
                type="file"
                ref={filePickerRef}
                onChange={addImageToProduct}
              />
              <h3
                className={`flex cursor-pointer space-x-2 rounded-sm border border-[#444] p-2 text-white ${
                  uploading && 'cursor-not-allowed'
                }`}
                onClick={() => !uploading && filePickerRef.current?.click()}
              >
                {uploading ? (
                  <Loader color="gray" size="sm" />
                ) : (
                  <UploadIcon className="h-6 w-6" />
                )}
                <span className="font-quick">
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </span>
              </h3>
            </div>
          ) : null}
          <div className="mt-3">
            <input
              {...register('price', { required: true, valueAsNumber: true })}
              type="number"
              className={`inputField w-full ${
                errors.price && 'border-red-500 focus:ring-red-500'
              }`}
              placeholder="Price"
            />
            {errors.price && (
              <p className="p-1 text-[13px] text-red-500">Price is required.</p>
            )}
          </div>
          <div className="mt-3">
            <textarea
              rows={4}
              {...register('description', { required: true, minLength: 8 })}
              className={`inputField w-full ${
                errors.description && 'border-red-500 focus:ring-red-500'
              }`}
              placeholder="Description"
            />
            {errors.description && (
              <p className="p-1 text-[13px] text-red-500">
                Description should be atleast 8 characters long.
              </p>
            )}
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="mt-4 bg-white p-2 font-quick font-semibold hover:bg-gray-300"
          >
            {isSubmitting ? (
              <Loader size="sm" color="dark" className="m-auto" />
            ) : (
              'Save'
            )}
          </button>
        </form>
      </main>
    </Layout>
  )
}

export default AddProduct
