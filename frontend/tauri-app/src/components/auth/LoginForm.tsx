import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { useAuthContext } from "@/context/AuthProvider";
import { toast } from "sonner";

type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuthContext();    // ⬅️  usa el hook

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch {
      toast.error("Credenciales inválidas");
    }
  };

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="correo@ejemplo.com"
            className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
            {...register("email", {
              required: "El correo es requerido",
              pattern: {
                value:
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electrónico inválido",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message:
                  "La contraseña debe tener al menos 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {errors.root && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}

      <Button
        type="submit"
        className="flex w-full justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión…
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;