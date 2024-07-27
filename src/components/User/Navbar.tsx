import React from 'react'
import { ModeToggle } from '../mode-toggle'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import Api from '@/services/api'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, userLogout } from '@/redux/slices/authSlice'
import { RootState } from '@/redux/store'

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})


function Navbar() {
  const { taskUserLoggedIn } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await Api.post('/login', data)
    if (response.data.success) {
      console.log(response.data.data);
      
      dispatch(setCredentials({ ...response.data.data }));
      navigate("/", { replace: true });
    }
  }

  const handleLogout = async () => {
    dispatch(userLogout())
    navigate("/", { replace: true });
  }

  return (
    <div className="w-full flex justify-between p-7 px-12 border-b-2">
      <NavLink to='/' className="p-3">Productiv</NavLink>
      <div className="flex space-x-14">
      </div>
      <div className="flex items-center justify-center space-x-5">
        {taskUserLoggedIn
          ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Want to continue?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )
          : (<AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Login</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Login now</AlertDialogTitle>
                <AlertDialogDescription className=''>
                  <div className="flex justify-center items-center mt-9">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="email" className='outline outline-1' {...field} />
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
                                <Input placeholder="Password" className='outline outline-1 '{...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-center">
                          <AlertDialogAction type="submit" className='w-full mt-10'>Login</AlertDialogAction>
                        </div>
                        <AlertDialogCancel className='w-full mt-10'>Cancel</AlertDialogCancel>
                        <p className='text-center'>new user?<NavLink to='/signup' className="p-2 text-blue-500">Signup</NavLink></p>
                      </form>
                    </Form>

                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog >)
        }

        <ModeToggle />
      </div >
    </div >
  )
}

export default Navbar