import LoginForm from "@/components/auth/LoginForm";

const Login = () => {  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tus credenciales para acceder al panel de control
          </p>
        </div>
        <LoginForm/>
      </div>
    </div>
  );
};



export default Login;
