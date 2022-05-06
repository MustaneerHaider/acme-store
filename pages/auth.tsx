import Head from 'next/head'
import { useState } from 'react'
import Header from '../components/Header'
import Logo from '../components/Logo'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { CREATE_USER_MUTATION } from '../graphql/operations'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Loader } from '@mantine/core'
import { NextPage } from 'next'
import Layout from '../components/Layout'

interface FormInputs {
  email: string
  password: string
}

export const toastStyles = {
  background: 'white',
  borderRadius: '9999px',
  fontWeight: 'bold',
  fontSize: '16px',
  color: 'black',
  padding: '15px',
}

const Auth: NextPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormInputs>()
  const [createUser] = useMutation(CREATE_USER_MUTATION)

  const switchAuthMode = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin)
  }

  const submitHandler: SubmitHandler<FormInputs> = async ({
    email,
    password,
  }) => {
    if (isLogin) {
      // log user in...
      setSubmitting(true)
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result!['error']) {
        setSubmitting(false)
        toast.error(result!['error'], {
          style: toastStyles,
          duration: 2000,
        })
      } else {
        router.replace('/')
      }
    } else {
      // signup
      try {
        setSubmitting(true)
        const result = await createUser({
          variables: { input: { email, password } },
        })
        if (result.errors) {
          throw new Error(result.errors[0].message)
        }
        if (result.data) {
          toast.success('Account created successfully.', {
            style: toastStyles,
            duration: 2000,
          })
          setIsLogin(true)
          setSubmitting(false)
        }
      } catch (err: any) {
        setSubmitting(false)
        toast.error(err, {
          style: toastStyles,
          duration: 2000,
        })
      }
    }
  }

  return (
    <Layout className="h-screen bg-gray-100" showFooter={false}>
      <main className="mx-5 mt-10 max-w-md sm:mx-auto">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col bg-black py-10 px-12"
        >
          <Logo className="mx-auto h-16 w-16 rounded-full border bg-white" />
          <div className="mt-10">
            <input
              {...register('email', { required: true })}
              type="email"
              className={`inputField w-full ${
                errors.email && 'border-red-500 focus:ring-red-600'
              }`}
              placeholder="Email"
            />
            {errors.email && (
              <p className="p-1 text-[13px] text-red-500">Email is required.</p>
            )}
          </div>
          <div className="mt-3">
            <input
              {...register('password', { required: true, minLength: 6 })}
              type="password"
              className={`inputField w-full ${
                errors.password && 'border-red-500 focus:ring-red-500'
              }`}
              placeholder="Password"
            />
            {errors.password && (
              <p className="p-1 text-[13px] text-red-500">
                Password should be atleast 6 characters long.
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
            ) : isLogin ? (
              'Login'
            ) : (
              'Sign up'
            )}
          </button>
          <h3 className="mt-5 font-quick text-sm text-white">
            {isLogin ? "Don't have an account?" : 'Do you have an account?'}{' '}
            <span
              className="cursor-pointer font-semibold hover:underline"
              onClick={switchAuthMode}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </span>
          </h3>
        </form>
      </main>
    </Layout>
  )
}

export default Auth
