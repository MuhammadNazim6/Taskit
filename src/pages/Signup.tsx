import React, { useEffect } from 'react'
import Navbar from '@/components/User/Navbar'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useGoogleLogin } from '@react-oauth/google';
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NavLink, useNavigate } from 'react-router-dom'
import Api from '@/services/api'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '@/redux/slices/authSlice'
import { RootState } from '@/redux/store'
import axios from 'axios';


const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 4 characters long.",
  }),
})
function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { taskUserLoggedIn } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (taskUserLoggedIn) {
      navigate("/", { replace: true });
    }
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await Api.post('/signup', data)
    if (response.data.success) {
      dispatch(setCredentials({ ...response.data.data }));
      navigate("/", { replace: true });
    }
  }

  const GoogleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`
        );
        const googleUserData = {
          name: res.data.name,
          email: res.data.email,
          password: res.data.sub,
          isGoogle: true
        }
        const signed = await Api.post('/google-signin', googleUserData)
        if (signed.data.success) {
          dispatch(setCredentials({ ...signed.data.data }))
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/3 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" className="outline outline-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" className="outline outline-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Password" className="outline outline-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" className="w-full mt-10">Signup</Button>
            </div>
            <div onClick={() => GoogleSignup()} className='cursor-pointer'>
              <a
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="mr-2">Sign in with Google</span>

                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262"><path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" /><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" /><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" /><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" /></svg>
              </a>
            </div>
            <p className="text-center">
              <NavLink to='/' className="p-2 text-blue-500">Go Home</NavLink>
            </p>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Signup