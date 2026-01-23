import { FieldError, UseFormRegister } from "react-hook-form";

interface FormInputProps<T> {
  label: string;
  name: keyof T;
  type?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
}

export default function FormInput<T>({
  label,
  name,
  type = "text",
  register,
  error,
}: FormInputProps<T>) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        {...register(name as string)}
        aria-invalid={!!error}
        className="w-full border p-2 rounded"
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
