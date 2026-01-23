"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/app/components/formInput";
import { contactSchema, ContactFormData } from "@/app/schemas/contact.schema";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact Form Submitted:", data);
    alert("Message Sent Successfully!");
  };

  return (
    <main className="p-6 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">Contact Us</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 bg-gray-50 p-6 border rounded-lg"
      >
        <FormInput<ContactFormData>
          label="Name"
          name="name"
          register={register}
          error={errors.name}
        />

        <FormInput<ContactFormData>
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
        />

        <FormInput<ContactFormData>
          label="Message"
          name="message"
          register={register}
          error={errors.message}
        />

        <button
          disabled={isSubmitting}
          className="bg-green-600 text-white px-4 py-2 mt-2 rounded hover:bg-green-700"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
