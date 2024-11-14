"use client";

import { signIn } from "@/actions/auth/action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "እባክዎ ትክክለኛ ኢሜል ያስገቡ።" }),
  password: z
    .string()
    .min(1, { message: "እባክዎ የይለፍ ቃልዎን ያስገቡ።" }),
  remember: z.boolean().default(false).optional(),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const { mutate, isSuccess, error } = useMutation({
    mutationKey: ["signIn"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await signIn(values);
      if (!response.ok) throw new Error(response.message || "Something went wrong!");
      return response;
    },
    onMutate: () => {
      console.log("ኢሜልዎን እና የይለፍ ቃልዎን በማረጋገጥ ላይ፣ እባክዎ ይጠብቁ...");
    },
    onSuccess: (data) => {
      console.log(data.message || "Login successful!");
      router.push("/feedback");
    },
    onError: (error: any) => {
      console.error(error.message || "እባክዎ እንደሆነ ችግኝ ተከስቷል።");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return !isSuccess ? (
    <main className="grid h-full grid-cols-2">
      <section className="flex h-full flex-col justify-center gap-7 px-24">
        <div>
          <h2 className="mb-2 mt-5 text-xl font-medium text-gray-900">እንኳን ደህና መጡ!</h2>
          <p className="text-sm font-light text-gray-700">
            እባክዎ ለመግባት የተጠቃሚ መለያዎን እና የይለፍ ቃልዎን ያስገቡ።
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>የኢሜይል አድራሻዎን ያስገቡ</FormLabel>
                  <FormControl>
                    <Input tabIndex={1} {...field} />
                  </FormControl>
                  <FormMessage className="form-error-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">የይለፍ ቃልዎን ያስገቡ</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        tabIndex={2}
                        {...field}
                      />
                      <Button
                        type="button"
                        size={"icon"}
                        variant={"ghost"}
                        className="absolute right-1 top-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="form-error-message" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="secondary"
              className="flex w-full items-center gap-2"
              tabIndex={3}
            >
              <LogIn size={20} />
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-2 self-center">
          <p className="text-gray-800">የቴክኒክ ድጋፍ ለማግኘት</p>
          <Button variant="link" className="h-fit p-0 text-base">
            እኛን ያነጋግሩን
          </Button>
        </div>

        {error && (
          <div className="mt-4 text-red-600">
            <p>{error.message || "እባክዎ እንደሆነ ችግኝ ተከስቷል።"}</p>
          </div>
        )}
      </section>
    </main>
  ) : (
    <div className="flex h-full justify-center items-center">
      <p className="text-lg text-green-600">ግባት ተሳክቷል፣ እባኮትን ተመክሮ ወደ እባኮት ሰርቪስ ሂዱ</p>
    </div>
  );
}
