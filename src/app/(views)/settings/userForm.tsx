'use client';

import { registerUser } from '@/lib/actions';
import { useState, useEffect } from 'react';
import { z } from 'zod';

const roles = ['ADMIN', 'USER'] as const;
// Zod schema for form validation
export const formSchema = z.object({
  username: z.string().min(1, { message: 'Nombre de usuario es requerido' }),
  password: z
    .string()
    .min(9, { message: 'La contraseña debe tener al menos 9 caracteres' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'La contraseña debe contener al menos un carácter especial',
    }),
  role: z.enum(roles, {
    errorMap: () => ({ message: 'Rol del usuario es requerido' }),
  }),
});

// Infer the type from the schema
type FormData = z.infer<typeof formSchema>;

// Define the type for errors
type FormErrors = {
  [K in keyof FormData]?: string;
} & {
  server?: string[];
};

interface UserFormProps {}

export default function UserForm({}: UserFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    role: roles[1],
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'radius' ? parseFloat(value) || 0 : value,
    }));
  };

  useEffect(() => {
    const validateForm = () => {
      try {
        formSchema.parse(formData);
        setErrors({});
        setIsFormValid(true);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: FormErrors = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as keyof FormData] = err.message;
            }
          });
          setErrors(newErrors);
          setIsFormValid(false);
        }
      }
    };

    validateForm();
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage(null);

    const result = await registerUser(formData);

    if (result.success) {
      setSuccessMessage(result.message);
      setFormData({ username: '', password: '', role: roles[1] });
    } else {
      setErrors(result.errors || {});
    }

    setIsSubmitting(false);
  };

  return (
    <div className=" bg-gray-100 p-8">
      <div>
        <h1 className="text-2xl font-bold text-center mb-8">
          Registro de Usuarios
        </h1>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1  gap-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rol del Usuario
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                )}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full px-4 py-2 text-white font-semibold rounded-md ${
                    isFormValid
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Registrar Usuario
                </button>
              </div>
            </div>
          </form>
          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          {errors.server && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {errors.server[0]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
