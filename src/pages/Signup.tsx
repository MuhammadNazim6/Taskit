import React from 'react'
import Navbar from '@/components/User/Navbar'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NavLink } from 'react-router-dom'
import Api from '@/services/api'


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
    console.log(response);

  }
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